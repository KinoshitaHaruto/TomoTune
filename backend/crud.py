from sqlalchemy.orm import Session
from sqlalchemy import func # 集計用(COUNTとか)
from datetime import datetime
import uuid
from models import User, Song, LikeLog

# --- 曲の操作 ---

def get_all_songs(db: Session):
    """全曲リストを取得する"""
    return db.query(Song).all()

def get_song_by_id(db: Session, song_id: int):
    """IDで曲を探す"""
    return db.query(Song).filter(Song.id == song_id).first()

# --- ユーザーの操作 ---
# 名前からユーザーを探す
def get_user_by_name(db: Session, name: str):
    return db.query(User).filter(User.name == name).first()

# IDからユーザーを探す
def get_user_by_id(db: Session, user_id: str):
    return db.query(User).filter(User.id == user_id).first()

# 新しいユーザーを登録する
def create_user(db: Session, name: str):
    # UUID4 (ランダムなID) を生成して文字列にする
    new_id = str(uuid.uuid4())
    
    new_user = User(
        id=new_id,
        name=name,
        music_type_code=None
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

def get_test_user(db: Session):
    """
    開発用のテストユーザーを取得する
    """
    test_userID = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11"
    return db.query(User).filter(User.id == test_userID).first()


# --- ❤️の操作 ---

def create_like(db: Session, user_id: str, song_id: int):
    """ハートログをDBに保存する"""
    new_like = LikeLog(
        user_id=user_id,
        song_id=song_id,
        timestamp=datetime.now()
    )
    db.add(new_like)
    db.commit()
    db.refresh(new_like) # 念のため最新情報を読み込む
    return new_like

def count_likes(db: Session, song_id: int, user_id: str) -> int:
    """
    特定のユーザーがその曲を何回ハートしたか数える
    SQL: SELECT COUNT(*) FROM like_logs WHERE user_id=... AND song_id=...
    """
    return db.query(LikeLog).filter(
        LikeLog.user_id == user_id,
        LikeLog.song_id == song_id
    ).count()

