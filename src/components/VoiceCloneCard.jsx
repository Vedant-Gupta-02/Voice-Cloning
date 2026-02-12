import { useState, useRef } from "react";
import { Upload, Mic, Loader2, CheckCircle, StopCircle, Play, Pause } from "lucide-react";
import { motion } from "framer-motion";

export default function VoiceCloneCard() {
    const [audio, setAudio] = useState(null);
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);
    const [outputAudio, setOutputAudio] = useState(null);
    const [consent, setConsent] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [audioURL, setAudioURL] = useState(null);

    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
                const audioFile = new File([audioBlob], "recording.wav", { type: "audio/wav" });
                setAudio(audioFile);
                setAudioURL(URL.createObjectURL(audioBlob));
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
        } catch (err) {
            console.error("Error accessing microphone:", err);
            alert("Could not access microphone.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        }
    };

    const handleSubmit = async () => {
        if (!audio || !text || !consent) return;

        setLoading(true);
        setOutputAudio(null);

        try {
            const formData = new FormData();
            formData.append("text", text);
            formData.append("audio", audio);
            formData.append("language", "hi"); // Default to Hindi as per inference.py

            const response = await fetch("http://localhost:8000/clone", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to generate voice");
            }

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            setOutputAudio(url);
        } catch (error) {
            console.error("Error generating voice:", error);
            alert("Error generating voice. Make sure the backend is running.");
        } finally {
            setLoading(true); // Keeping loading state until output is ready or error handled
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative w-full max-w-2xl rounded-3xl bg-elcard border border-elborder shadow-glow p-10"
        >
            {/* Glow Accent */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-elaccent/10 blur-[120px] rounded-full pointer-events-none" />

            {/* Header */}
            <div className="mb-10">
                <h1 className="text-3xl font-semibold tracking-tight flex items-center gap-3">
                    <Mic className="text-elaccent" />
                    22 Labs
                </h1>
                <p className="text-elmuted mt-3 text-sm leading-relaxed max-w-md">
                    Generate expressive, natural speech in the voice of any speaker using
                    a short audio reference.
                </p>
            </div>

            {/* Upload */}
            <section className="mb-8">
                <h2 className="text-sm font-medium mb-2 text-zinc-300">
                    Reference Voice
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Upload */}
                    <label className="block">
                        <div className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-zinc-900 border border-elborder hover:border-elaccent/40 transition cursor-pointer h-full">
                            <Upload className="text-elaccent w-5 h-5" />
                            <span className="text-sm text-zinc-300 truncate">
                                {audio && !audioURL ? audio.name : "Upload wav/mp3"}
                            </span>
                            {audio && !audioURL && (
                                <CheckCircle className="ml-auto text-green-500 w-5 h-5 flex-shrink-0" />
                            )}
                        </div>
                        <input
                            type="file"
                            accept="audio/*"
                            className="hidden"
                            onChange={(e) => {
                                setAudio(e.target.files[0]);
                                setAudioURL(null);
                            }}
                        />
                    </label>

                    {/* Record */}
                    <button
                        onClick={isRecording ? stopRecording : startRecording}
                        className={`flex items-center gap-3 px-5 py-4 rounded-2xl border transition ${isRecording
                                ? "bg-red-500/10 border-red-500 text-red-500"
                                : "bg-zinc-900 border-elborder text-zinc-300 hover:border-elaccent/40"
                            }`}
                    >
                        {isRecording ? (
                            <StopCircle className="w-5 h-5 animate-pulse" />
                        ) : (
                            <Mic className="text-elaccent w-5 h-5" />
                        )}
                        <span className="text-sm font-medium">
                            {isRecording ? "Stop Recording" : "Record Voice"}
                        </span>
                        {audioURL && !isRecording && (
                            <CheckCircle className="ml-auto text-green-500 w-5 h-5" />
                        )}
                    </button>
                </div>

                {audioURL && (
                    <div className="mt-4 flex items-center gap-3 p-3 rounded-xl bg-zinc-900/50 border border-elborder">
                        <p className="text-xs text-zinc-400">Captured Recording</p>
                        <audio src={audioURL} controls className="h-8 flex-1" />
                    </div>
                )}

                <p className="text-xs text-zinc-500 mt-2">
                    Recommended: ≥5 seconds, clean speech, no background noise
                </p>
            </section>

            {/* Text */}
            <section className="mb-8">
                <h2 className="text-sm font-medium mb-2 text-zinc-300">
                    Text to Generate
                </h2>

                <textarea
                    placeholder="Type what you want the voice to say..."
                    className="w-full h-32 px-5 py-4 rounded-2xl bg-zinc-900 border border-elborder focus:outline-none focus:border-elaccent/50 resize-none text-sm"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />

                <div className="flex justify-between text-xs text-zinc-500 mt-2">
                    <span>Natural punctuation improves realism</span>
                    <span>{text.length} characters</span>
                </div>
            </section>

            {/* Consent */}
            <section className="mb-8 flex items-start gap-3">
                <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-1 accent-elaccent"
                />
                <p className="text-xs text-zinc-400 leading-relaxed">
                    I confirm that I have the legal right to use this voice and understand
                    the ethical responsibilities of voice cloning.
                </p>
            </section>

            {/* Generate */}
            <button
                onClick={handleSubmit}
                disabled={!audio || !text || !consent || loading}
                className="w-full py-4 rounded-2xl bg-elaccent text-black font-medium text-sm hover:opacity-90 transition disabled:opacity-40"
            >
                {loading ? (
                    <span className="flex items-center justify-center gap-2">
                        <Loader2 className="animate-spin w-4 h-4" />
                        Generating voice…
                    </span>
                ) : (
                    "Generate Voice"
                )}
            </button>

            {/* Output */}
            {outputAudio && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-10 p-6 rounded-2xl bg-zinc-900 border border-elborder"
                >
                    <p className="text-xs text-zinc-400 mb-3 font-medium uppercase tracking-wider">Result</p>
                    <audio src={outputAudio} controls className="w-full" autoPlay />
                    <a
                        href={outputAudio}
                        download="cloned_voice.wav"
                        className="inline-block mt-4 text-xs text-elaccent hover:underline"
                    >
                        Download Result
                    </a>
                </motion.div>
            )}
        </motion.div>
    );
}
