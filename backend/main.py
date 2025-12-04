import logging
import json
from fastapi import FastAPI, Depends, status, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session, joinedload
from pydantic import BaseModel
import os

import models
import crud
from database import get_db

import typeCal


LIKE_MILESTONE = 5

# How to run
# cd backend
# uvicorn main:app --reload
API_URL="http://127.0.0.1:8000"
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("uvicorn")

app = FastAPI()

# ngrok用にCORSを全許可
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],    
    allow_headers=["*"],
)

# --- パス設定 ---
# backendディレクトリの場所
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# 音楽ファイルの場所
STATIC_DIR = os.path.join(BASE_DIR, "static")
# Reactのビルド成果物の場所 (backendの親のfrontendのdist)
DIST_DIR = os.path.join(os.path.dirname(BASE_DIR), "frontend", "dist")

app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

# --- リクエスト / レスポンスモデル ---
class LoginRequest(BaseModel):
    name: str

class LikeRequest(BaseModel):
    song_id: int
    user_id: str


class PostCreateRequest(BaseModel):
    user_id: str
    song_id: int
    comment: str


# --- API ---

# 全曲取得API
@app.get("/songs")
def read_songs(db: Session = Depends(get_db)):
    return crud.get_all_songs(db)

@app.post("/login")
def login(req: LoginRequest, db: Session = Depends(get_db)):
    # その名前の人がいるか探す
    user = crud.get_user_by_name(db, req.name)
    
    # いなければ新しく作る
    if not user:
        user = crud.create_user(db, req.name)
        logger.info(f"✨ New User Created: {user.name} ({user.id})")
    else:
        logger.info(f"🔙 Login: {user.name} ({user.id})")
    
    # ユーザー情報を返す
    return user

# 診断結果受け取り用モデル
class DiagnosisRequest(BaseModel):
    user_id: str
    score_vc: float # 0.0 - 1.0
    score_ma: float
    score_pr: float
    score_hs: float

# 診断結果保存API
@app.post("/diagnosis")
def save_diagnosis(req: DiagnosisRequest, db: Session = Depends(get_db)):
    user = crud.get_user_by_id(db, req.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # 1. スコアを更新
    user.score_vc = req.score_vc
    user.score_ma = req.score_ma
    user.score_pr = req.score_pr
    user.score_hs = req.score_hs

    # 2. タイプコードを判定 (typeCal再利用)
    new_code = typeCal.determine_music_type_code(
        req.score_vc, req.score_ma, req.score_pr, req.score_hs
    )
    user.music_type_code = new_code

    db.add(user)
    db.commit()
    
    logger.info(f"📝 Diagnosis Updated: {user.name} -> {new_code}")

    return {"status": "ok", "music_type_code": new_code}

# 詳細取得用API (Profile画面用)
@app.get("/users/{user_id}")
def get_user_detail(user_id: str, db: Session = Depends(get_db)):
    # joinedloadでMusicType情報も結合して取得
    user = db.query(models.User).options(joinedload(models.User.music_type)).filter(models.User.id == user_id).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # 診断結果データの整形
    music_type_data = None
    if user.music_type:
        music_type_data = {
            "code": user.music_type.code,
            "name": user.music_type.name,
            "description": user.music_type.description
        }

    return {
        "id": user.id,
        "name": user.name,
        "scores": {
            "VC": user.score_vc,
            "MA": user.score_ma,
            "PR": user.score_pr,
            "HS": user.score_hs
        },
        "music_type": music_type_data
    }

@app.post("/likes", status_code=status.HTTP_201_CREATED)
def create_like(like: LikeRequest, db: Session = Depends(get_db)):
    # 曲の存在チェック
    target_song = crud.get_song_by_id(db, like.song_id)
    if target_song is None:
        raise HTTPException(status_code=404, detail="曲が見つかりません")

    # テストユーザー取得 (DBから)
    user = crud.get_user_by_id(db, like.user_id)
    if not user:
        raise HTTPException(status_code=500, detail="テストユーザーがいません")
    
    if target_song.parameters:
        # 新しいスコアを計算
        new_vc, new_ma, new_pr, new_hs = typeCal.calculate_new_scores(user, target_song.parameters)
        
        # 新しいタイプコードを決定
        new_type_code = typeCal.determine_music_type_code(new_vc, new_ma, new_pr, new_hs)
        
        # ユーザー情報を更新
        user.score_vc = new_vc
        user.score_ma = new_ma
        user.score_pr = new_pr
        user.score_hs = new_hs
        user.music_type_code = new_type_code
        
        db.add(user)

    # いいね保存 (DBへ)
    crud.create_like(db, user.id, like.song_id)
    
    # 集計
    total = crud.count_likes(db, like.song_id, user.id)
    
    # 5回目以降は常に「お気に入り扱い」とする
    is_milestone = (total >= LIKE_MILESTONE)

    logger.info(f"[❤️]: User: {user.name} | SongID: {like.song_id} | Total: {total}")

    return {
        "status": "ok", 
        "total_likes": total, 
        "is_milestone": is_milestone,
        "user_music_type": user.music_type_code, 
        "scores": {
            "VC": user.score_vc,
            "MA": user.score_ma,
            "PR": user.score_pr,
            "HS": user.score_hs
        }
    }


# --- 投稿API ---

@app.post("/posts", status_code=status.HTTP_201_CREATED)
def create_post(req: PostCreateRequest, db: Session = Depends(get_db)):
    # ユーザー・曲の存在チェック
    user = crud.get_user_by_id(db, req.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    song = crud.get_song_by_id(db, req.song_id)
    if not song:
        raise HTTPException(status_code=404, detail="Song not found")

    post = crud.create_post(db, req.user_id, req.song_id, req.comment)
    logger.info(f"📝 New Post: user={user.name}, song_id={song.id}")

    return {
        "id": post.id,
        "comment": post.comment,
        "created_at": post.created_at.isoformat(),
        "user": {
            "id": user.id,
            "name": user.name,
        },
        "song": {
            "id": song.id,
            "title": song.title,
            "artist": song.artist,
            "url": song.url,
        },
    }


@app.get("/posts")
def list_posts(limit: int = 50, db: Session = Depends(get_db)):
    """
    最新の投稿を取得（Homeページ用）
    """
    posts = crud.get_recent_posts(db, limit=limit)

    results = []
    for p in posts:
        # 関連オブジェクトを明示的に参照（lazy load）
        user = p.user
        song = p.song
        results.append({
            "id": p.id,
            "comment": p.comment,
            "created_at": p.created_at.isoformat(),
            "user": {
                "id": user.id,
                "name": user.name,
            } if user else None,
            "song": {
                "id": song.id,
                "title": song.title,
                "artist": song.artist,
                "url": song.url,
            } if song else None,
        })

    return results

# ルートURL ("/") にアクセスが来たら、distフォルダの中身(index.html)を返す
if os.path.exists(DIST_DIR):
    app.mount("/", StaticFiles(directory=DIST_DIR, html=True), name="dist")
else:
    logger.warning(f"'dist' folder not found at {DIST_DIR}.")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
