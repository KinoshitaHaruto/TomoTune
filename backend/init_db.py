from database import engine, SessionLocal, Base
from models import User, Song
from data import songs, users
import os

# BASE_URL = "http://127.0.0.1:8000"
def init_database():
    print("データベース構築を開始...")

    # テーブルを全部作る (CREATE TABLE文の発行)
    # models.py で定義した User, Songの箱が作られる
    Base.metadata.create_all(bind=engine)
    print("テーブル作成完了")

    # DBを開く
    db = SessionLocal()

    try:
        # --- ユーザーの登録 ---
        # data.py の users リストから登録
        for u in users:
            # 重複チェック: IDが既にあるか
            existing = db.query(User).filter(User.id == u["id"]).first()
            if not existing:
                new_user = User(
                    id=u["id"],
                    name=u["name"],
                    mbti=u["mbti"]
                )
                db.add(new_user)
                print(f"ユーザー追加: {u['name']}")

        # --- 曲の登録 ---
        # data.py の songs リストから登録
        for s in songs:
            # 重複チェック: タイトルで確認
            existing = db.query(Song).filter(Song.title == s["title"]).first()
            if not existing:
                new_song = Song(
                    title=s["title"],
                    artist=s["artist"],
                    url=s["url"],
                    parameters=s["parameters"]
                )
                db.add(new_song)
                print(f"曲追加: {s['title']}")
        
        # まとめて保存 (コミット)
        db.commit()
        print("データベースの初期化が完了")
    except Exception as e:
        print(f"エラーが発生: {e}")
        db.rollback() # 失敗したら取り消す
    finally:
        db.close() # 必ず閉じる

if __name__ == "__main__":
    init_database()
