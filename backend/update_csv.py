import os
import csv

# 設定
STATIC_DIR = "static"
CSV_PATH = "songs.csv"

# 今回定義する全パラメータ（CSVのヘッダーになります）
CSV_HEADERS = [
    "filename", "title", "artist", 
    "acousticness", "danceability", "energy", "instrumentalness", 
    "liveness", "loudness", "speechiness", "valence", 
    "tempo", "key", "mode", "time_signature"
]

def update_csv():
    print("曲情報の同期を開始します...")

    # 1. 既存のCSVを読み込む（すでに入力済みのデータは消さない）
    existing_data = {}
    if os.path.exists(CSV_PATH):
        with open(CSV_PATH, mode='r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                existing_data[row["filename"]] = row

    # 2. フォルダをスキャン
    if not os.path.exists(STATIC_DIR):
        print(f"フォルダが見つかりません: {STATIC_DIR}")
        return

    final_rows = []
    added_count = 0

    # ファイル名順に処理
    for filename in sorted(os.listdir(STATIC_DIR)):
        if filename.endswith(".mp3"):
            
            # 既にCSVにある場合 -> 既存データをそのまま使う
            if filename in existing_data:
                final_rows.append(existing_data[filename])
            
            # 新しいファイルの場合 -> 空の行を作る
            else:
                title = filename.replace(".mp3", "").replace("_", " ")
                new_row = {
                    "filename": filename,
                    "title": title,
                    "artist": "Unknown Artist",
                    # パラメータは初期値（0や空）を入れておく
                    "acousticness": "0.0", "danceability": "0.0", "energy": "0.0",
                    "instrumentalness": "0.0", "liveness": "0.0", "loudness": "-60.0",
                    "speechiness": "0.0", "valence": "0.0", "tempo": "120",
                    "key": "0", "mode": "1", "time_signature": "4"
                }
                final_rows.append(new_row)
                added_count += 1
                print(f"新規追加: {title}")

    # 3. CSVに書き込む
    # (既存の曲も、新しい列順に合わせて書き直されるので整頓されます)
    with open(CSV_PATH, mode='w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=CSV_HEADERS)
        writer.writeheader()
        writer.writerows(final_rows)

    if added_count > 0:
        print(f"CSVを更新しました({added_count}曲追加)")
        print("songs.csv を開いて、パラメータ数値を入力してください。")
    else:
        print("CSVは最新です。")

if __name__ == "__main__":
    update_csv()