import logging
from fastapi import FastAPI, Depends, status, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from pydantic import BaseModel
import os

import crud
from database import get_db


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

# --- リクエストモデル ---
class LoginRequest(BaseModel):
    name: str

class LikeRequest(BaseModel):
    song_id: int
    user_id: str


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

    # いいね保存 (DBへ)
    crud.create_like(db, user.id, like.song_id)
    
    # 集計
    total = crud.count_likes(db, like.song_id, user.id)
    
    is_milestone = (total == LIKE_MILESTONE)

    logger.info(f"[❤️]: User: {user.name} | SongID: {like.song_id} | Total: {total}")

    return {
        "status": "ok", 
        "total_likes": total, 
        "is_milestone": is_milestone
    }

# ルートURL ("/") にアクセスが来たら、distフォルダの中身(index.html)を返す
if os.path.exists(DIST_DIR):
    app.mount("/", StaticFiles(directory=DIST_DIR, html=True), name="dist")
else:
    logger.warning(f"'dist' folder not found at {DIST_DIR}.")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
