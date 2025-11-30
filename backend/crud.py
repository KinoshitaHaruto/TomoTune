from sqlalchemy.orm import Session
from sqlalchemy import func # 集計用(COUNTとか)
import uuid
from models import User, Song

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
        mbti=None
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

