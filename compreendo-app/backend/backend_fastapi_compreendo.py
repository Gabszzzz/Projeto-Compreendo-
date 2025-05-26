from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import uvicorn
import os
from typing import Optional

app = FastAPI(title="Compreendo+ API")

# Configuração CORS (Permitir frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, troque por seu domínio
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelos
class SimplifyRequest(BaseModel):
    text: str

class SimplifyResponse(BaseModel):
    simplified_text: str
    tts_url: Optional[str] = None
    libras_video_url: Optional[str] = None

# Rotas
@app.get("/")
def home():
    return {"status": "API online"}

@app.post("/simplify", response_model=SimplifyResponse)
async def simplify_text(payload: SimplifyRequest):
    try:
        # Simulação - substitua por chamada real à OpenAI
        simplified = f"Texto simplificado: {payload.text[:50]}..." if payload.text else ""
        
        return SimplifyResponse(
            simplified_text=simplified,
            tts_url="/static/audio/exemplo.mp3",
            libras_video_url="/static/videos/libras_demo.mp4"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ocr")
async def extract_text(file: UploadFile = File(...)):
    try:
        # Simulação - substitua por OCR real
        return {"text": f"Texto extraído de {file.filename} (simulado)"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Erro no OCR: {str(e)}")

# Servir arquivos estáticos
app.mount("/static", StaticFiles(directory="../static"), name="static")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)