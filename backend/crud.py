from sqlalchemy.orm import Session
from sqlalchemy import func # 集計用(COUNTとか)
import os
from models import User, Song

# --- 曲の操作 ---

def get_all_songs(db: Session):
    """全曲リストを取得する"""
    return db.query(Song).all()

def get_song_by_id(db: Session, song_id: int):
    """IDで曲を探す"""
    return db.query(Song).filter(Song.id == song_id).first()

# --- ユーザーの操作 ---

def get_test_user(db: Session):
    """
    開発用のテストユーザーを取得する
    """
    test_userID = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11"
    return db.query(User).filter(User.id == test_userID).first()

