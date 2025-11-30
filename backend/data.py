from datetime import datetime
import uuid
import os

# サーバーのURL (自分のPCの住所)
BASE_URL = "http://127.0.0.1:8000"

# --- 曲リスト ---


songs = [
    {
        "id": 1,
        "title": "Morning",
        "artist": "しゃろう",
        "url": f"{BASE_URL}/static/Morning.mp3"  # サンプル曲のURL
    },
    {
        "id": 2,
        "title": "テストソング",
        "artist": "テストアーティスト",
        "url": "" # ファイルがない場合のテスト用
    }
]

# 曲IDをキーにして曲データを素早く取得できるようにする辞書
songs_map = {song["id"]: song for song in songs}

# --- ユーザーリスト ---
users = [
    {
        "id" : "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
        "name" : "Test User",
        "mbti" : "AAAA"
    }
]