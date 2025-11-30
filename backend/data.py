from datetime import datetime
import uuid
import os

# サーバーのURL (自分のPCの住所)
BASE_URL = "http://127.0.0.1:8000"

# --- 曲リスト ---
def scan_static_files():
    """staticフォルダ内の音楽ファイルをスキャンしてsongsリストを更新する"""
    base_dir = os.path.dirname(os.path.abspath(__file__))
    static_dir = os.path.join(base_dir, "static")
    songs = []
    for i, filename in enumerate(os.listdir(static_dir)):
        if filename.endswith(".mp3"):
            title = filename.replace(".mp3", "").replace("_", " ")  #タイトル(mp3拡張子を削除しアンダースコアをスペースに変換)
            song = {
                "id": i + 1,
                "title": title,
                "artist": "Unknown Artist",  # アーティスト情報は不明
                "url": f"{BASE_URL}/static/{filename}"
            }
            songs.append(song)
    return songs

songs = scan_static_files()

songs.append({
        "id": 2,
        "title": "テストソング",
        "artist": "テストアーティスト",
        "url": "" # ファイルがない場合のテスト用
    })


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