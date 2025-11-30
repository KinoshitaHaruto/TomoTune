from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

# ユーザーテーブル
class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)   # UUIDを使うのでString型
    name = Column(String, index=True)
    mbti = Column(String, nullable=True) # まだ決まってない人はNone(null)

# 曲テーブル
class Song(Base):
    __tablename__ = "songs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    artist = Column(String)
    url = Column(String) # mp3ファイルのパス

