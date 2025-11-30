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
    
    # リレーション: ユーザーはたくさんの「いいねログ」を持つ
    like_logs = relationship("LikeLog", back_populates="user")

# 曲テーブル
class Song(Base):
    __tablename__ = "songs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    artist = Column(String)
    url = Column(String) # mp3ファイルのパス

    # リレーション: 曲もたくさんの「いいねログ」を持つ
    like_logs = relationship("LikeLog", back_populates="song")


# いいね履歴テーブル (ログ)
class LikeLog(Base):
    __tablename__ = "like_logs"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    
    # 外部キー: 誰が
    user_id = Column(String, ForeignKey("users.id"))
    
    # 外部キー: どの曲を
    song_id = Column(Integer, ForeignKey("songs.id"))
    
    # いつ (初期値は現在時刻)
    timestamp = Column(DateTime, default=datetime.now)

    # リレーション設定
    user = relationship("User", back_populates="like_logs")
    song = relationship("Song", back_populates="like_logs")