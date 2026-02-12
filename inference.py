import torch
import torchaudio
from pathlib import Path
from TTS.tts.configs.xtts_config import XttsConfig
from TTS.tts.models.xtts import Xtts

ROOT = Path(__file__).parent
CONFIG_PATH = ROOT / "config.json"
VOCAB_PATH = ROOT / "vocab.json"
CHECKPOINT_PATH = ROOT / "best_model_951.pth"
OUTPUT_DIR = ROOT / "outputs"
OUTPUT_DIR.mkdir(exist_ok=True)

class VoiceSynthesizer:
    def __init__(self):
        self.model = None
        self.config = None
        self.device = "cuda" if torch.cuda.is_available() else "cpu"

    def load_model(self):
        if self.model is not None:
            return

        print(f"Loading model on {self.device}...")
        self.config = XttsConfig()
        self.config.load_json(str(CONFIG_PATH))

        self.model = Xtts.init_from_config(self.config)
        self.model.load_checkpoint(
            self.config,
            checkpoint_path=str(CHECKPOINT_PATH),
            vocab_path=str(VOCAB_PATH),
            eval=True
        )
        self.model.to(self.device)
        print("Model loaded successfully.")

    def synthesize(self, text, speaker_wav_path, language="hi", output_filename="output.wav"):
        if self.model is None:
            self.load_model()

        output_path = OUTPUT_DIR / output_filename

        outputs = self.model.synthesize(
            text=text,
            config=self.config,
            speaker_wav=str(speaker_wav_path),
            language=language
        )

        wav = torch.tensor(outputs["wav"]).unsqueeze(0)
        torchaudio.save(str(output_path), wav, 24000)

        return output_path

# Global instance for easy access
synthesizer = VoiceSynthesizer()

if __name__ == "__main__":
    # Test script
    # synthesizer.load_model()
    # output = synthesizer.synthesize("नमस्ते, कैसे हैं आप?", "path_to_some_test_speaker.wav")
    # print(f"Saved to {output}")
    pass
