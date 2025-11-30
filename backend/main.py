from fastapi import FastAPI # サーバーを作るため
from fastapi.middleware.cors import CORSMiddleware  # CORS対策のための許可証
from fastapi.staticfiles import StaticFiles # 静的ファイルを配信するため
from data import songs


# How to Run:
# cd backend
# uvicorn main:app --reload


# アプリのインスタンス作成
app = FastAPI()

# 許可証の発行
app.add_middleware(
    CORSMiddleware,
    # 「この住所からのアクセスなら許可する」リスト
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],  # どんな命令(GET, POSTなど)もOK
    allow_headers=["*"],  # どんなヘッダー情報もOK
)


# 音楽ファイル置き場の公開
# URLで "/static" と指定されたら、実際の "static" フォルダの中身を見せる
app.mount("/static", StaticFiles(directory="static"), name="static")

# 「/」というURLにアクセスが来たら実行する関数
@app.get("/")
def read_root():
    # JSON形式のデータを返す
    return {"message": "Hello, TomoTune!"}

@app.get("/hello")
def say_hello():
    return {"message": "Hello from main.py!"}

# 曲リストを返すAPI
@app.get("/songs")
def get_songs():
    return songs