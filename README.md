# 22 Labs - Voice Cloning UI

A full-stack application that allows users to clone voices using a short audio reference and generate natural expressive speech using the XTTS v2 model.

## Features

- **Voice Recording**: Capture your own voice directly in the browser.
- **Audio Upload**: Support for `.wav` and `.mp3` reference files.
- **Natural Synthesis**: High-quality text-to-speech generation.
- **FastAPI Backend**: Efficient model inference handling.

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Framer Motion, Lucide React.
- **Backend**: FastAPI, PyTorch, TTS (XTTS v2).

---

## Getting Started

### Prerequisites

- Python 3.9+
- Node.js & npm
- FFmpeg (required by TTS)

### 1. Backend Setup

1. Navigate to the project directory:
   ```bash
   cd voice-clone-ui
   ```

2. Install Python dependencies:
   ```bash
   pip install fastapi uvicorn python-multipart TTS torch torchaudio
   ```

3. Ensure you have the required model files in the root folder:
   - `best_model_951.pth`
   - `config.json`
   - `vocab.json`

4. Start the FastAPI server:
   ```bash
   python app.py
   ```
   *The server runs on `http://localhost:8000`.*

### 2. Frontend Setup

1. In a new terminal, install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```
   *The app runs on `http://localhost:5173`.*

---

## How to use

1. **Provide a reference**: Either click "Record Voice" to record a sample (≥5s recommended) or "Upload wav/mp3" to choose a file.
2. **Input Text**: Type what you want the cloned voice to say.
3. **Generate**: Check the consent box and click "Generate Voice".
4. **Result**: Your generated audio will appear at the bottom for playback and download.

---

## Deployment / GitHub Upload

Since this project contains a very large model file (`best_model_951.pth`), follow these steps to upload to GitHub:

1. Initialize Git:
   ```bash
   git init
   ```
2. Add files (excluding the large model):
   ```bash
   git add .
   ```
3. Commit:
   ```bash
   git commit -m "Initial commit: Voice Cloning Integration"
   ```
4. Push to your repository:
   ```bash
   git remote add origin <your-repo-url>
   git branch -M main
   git push -u origin main
   ```

> [!IMPORTANT]
> The `.pth` model file is too large for standard GitHub repositories. We recommend hosting the model on Google Drive or HuggingFace and adding a download link to this README for others to set it up.
