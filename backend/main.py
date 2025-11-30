from fastapi import FastAPI # サーバーを作るため
from fastapi.middleware.cors import CORSMiddleware  # CORS対策のための許可証


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

# 「/」というURLにアクセスが来たら実行する関数
@app.get("/")
def read_root():
    # JSON形式のデータを返す
    return {"message": "Hello, TomoTune!"}

@app.get("/hello")
def say_hello():
    return {"message": "Hello from main.py!"}