# backend/app/main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import sqlite3

app = FastAPI(title="Visionary Vault API")

# Enable CORS if frontend is hosted separately during dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 🔒 Lock down in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/images")
def get_images():
    # Placeholder - you’ll plug in metadata queries here
    return {"images": []}

@app.get("/api/tags")
def get_tags():
    # Placeholder - you’ll fetch from SQLite later
    return {"tags": []}
