from datetime import datetime
import csv
import uuid
import json
import os

# サーバーのURL (自分のPCの住所)
# BASE_URL = "http://127.0.0.1:8000"

# --- 曲リスト ---

# CSV読み込み
def load_song_metadata():
    """songs.csv を読み込んで、ファイル名をキーにした辞書を作る"""
    metadata = {}
    base_dir = os.path.dirname(os.path.abspath(__file__))
    csv_path = os.path.join(base_dir, "songs.csv")
    
    if not os.path.exists(csv_path):
        return {}

    with open(csv_path, mode='r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            metadata[row["filename"]] = row
    return metadata

# staticフォルダ内の音楽ファイルをスキャンして曲リストを作成
def scan_static_files():
    """staticフォルダとCSVを照らし合わせて曲リストを作る"""
    base_dir = os.path.dirname(os.path.abspath(__file__))
    static_dir = os.path.join(base_dir, "static")
    songs = []
    
    # CSVデータを読み込む
    metadata_map = load_song_metadata()

    if not os.path.exists(static_dir):
        return []

    # ファイル名順に処理
    for i, filename in enumerate(sorted(os.listdir(static_dir)), start=1):
        if filename.endswith(".mp3"):
            
            # A. CSVに情報がある場合 -> それを使う
            if filename in metadata_map:
                data = metadata_map[filename]
                title = data["title"]
                artist = data["artist"]
                
                # パラメータを辞書としてまとめる
                params = {
                    "acousticness": data.get("acousticness", 0),
                    "danceability": data.get("danceability", 0),
                    "energy": data.get("energy", 0),
                    "instrumentalness": data.get("instrumentalness", 0),
                    "liveness": data.get("liveness", 0),
                    "loudness": data.get("loudness", 0),
                    "speechiness": data.get("speechiness", 0),
                    "valence": data.get("valence", 0),
                    "tempo": data.get("tempo", 0),
                    "key": data.get("key", 0),
                    "mode": data.get("mode", 0),
                    "time_signature": data.get("time_signature", 0),
                }
            
            # B. CSVにない場合 -> ファイル名から推測
            else:
                title = filename.replace(".mp3", "").replace("_", " ")
                artist = "Unknown Artist"
                params = {} 

            song = {
                "id": i,
                "title": title,
                "artist": artist,
                "url": f"/static/{filename}",
                # 辞書をJSON文字列に変換して保存
                "parameters": json.dumps(params)
            }
            songs.append(song)
    
    return songs

songs = scan_static_files()

# --- Music Typeリスト ---
def load_music_types():
    """musicType.csv を読み込んでリストを作る"""
    types = []
    base_dir = os.path.dirname(os.path.abspath(__file__))
    csv_path = os.path.join(base_dir, "musicType.csv")
    
    if not os.path.exists(csv_path):
        print(f"{csv_path} が見つかりません。")
        return []

    with open(csv_path, mode='r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            types.append({
                "code": row["code"],
                "name": row["name"],
                "description": row["description"]
            })
    return types

# 変数に入れておく（init_db.pyで使うため）
music_types = load_music_types()
# --- ユーザーリスト ---
users = [
    {
        "id" : "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
        "name" : "Test User",
        "music_type_code" : "VMPH"
    }
]