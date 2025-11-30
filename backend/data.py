# backend/data.py

# サーバーのURL (自分のPCの住所)
BASE_URL = "http://127.0.0.1:8000"

# 曲のリスト (これをReactに送ります)
songs = [
    {
        "id": 1,
        "title": "Morning",
        "artist": "しゃろう",
        "url": f"{BASE_URL}/static/Morning.mp3"     # 音楽ファイルへのリンク
    },
    {
        "id": 2,
        "title": "テストソング",
        "artist": "テストアーティスト",
        "url": "" # ファイルがない場合のテスト用
    }
]
