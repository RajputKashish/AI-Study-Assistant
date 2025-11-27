import { useState } from "react";
import { generateStudyMaterial } from "../api";
import "./notesForm.css";

export default function NotesForm({ setResult }) {
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);

    // Handle generate study material
    const handleSubmit = async () => {
        if (!text.trim()) {
            alert("Please provide some study material!");
            return;
        }
        setLoading(true);
        try {
            const { data } = await generateStudyMaterial(text);
            if (data.summary && data.quiz) setResult(data);
            else alert("Invalid response format from server.");
        } catch (err) {
            console.error(err);
            alert("Error generating study material. Please try again.");
        }
        setLoading(false);
    };

    const handleClear = () => {
        setText("");
        setResult(null);
    };

    return (
        <div className="notes-form-container">
            <div className="form-header">
                <h2 className="form-title">
                   Input Your Notes
                </h2>
                <p className="form-description">
                    Paste your notes, upload a PDF, or upload a video (backend transcription required)
                </p>
            </div>

            <div className="form-content">
                <div className="textarea-container">
                    <textarea
                        className="notes-textarea"
                        rows="10"
                        placeholder="Paste or upload your study material here..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                    <div className="character-count">{text.length} characters</div>
                </div>

                <div className="form-actions">
                    <button
                        className="clear-btn"
                        onClick={handleClear}
                        disabled={!text || loading}
                    >
                        Clear
                    </button>
                    <button
                        className="generate-btn"
                        onClick={handleSubmit}
                        disabled={loading || !text.trim()}
                    >
                        {loading ? "Generating..." : " Generate Study Material"}
                    </button>
                </div>
            </div>
        </div>
    );
}
