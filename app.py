import os
import shutil
import uuid
from pathlib import Path
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from inference import synthesizer

app = FastAPI()

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

@app.on_event("startup")
async def startup_event():
    # Load model on startup to avoid delay on first request
    # This might take a while due to 5.6GB model size
    synthesizer.load_model()

@app.post("/clone")
async def clone_voice(
    text: str = Form(...),
    language: str = Form("hi"),
    audio: UploadFile = File(...)
):
    try:
        # Generate a unique ID for this request
        request_id = str(uuid.uuid4())
        
        # Save the uploaded speaker file
        speaker_filename = f"{request_id}_{audio.filename}"
        speaker_path = UPLOAD_DIR / speaker_filename
        
        with speaker_path.open("wb") as buffer:
            shutil.copyfileobj(audio.file, buffer)
        
        # Run synthesis
        output_filename = f"out_{request_id}.wav"
        output_path = synthesizer.synthesize(
            text=text,
            speaker_wav_path=speaker_path,
            language=language,
            output_filename=output_filename
        )
        
        # Return the generated file
        return FileResponse(
            path=output_path,
            filename=output_filename,
            media_type="audio/wav"
        )
        
    except Exception as e:
        print(f"Error during synthesis: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Cleanup uploaded file if needed (optional)
        # if speaker_path.exists():
        #     os.remove(speaker_path)
        pass

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
