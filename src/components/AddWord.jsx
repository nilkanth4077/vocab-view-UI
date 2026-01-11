import { useState } from "react";
import "./VocabSearch.css";

export function AddWord() {
    const [form, setForm] = useState({
        text: "",
        partOfSpeech: "",
        synonymReference: "",
        antonymReference: ""
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (!form.text.trim()) {
            setError("Word is required");
            return;
        }

        setError("");
        setMessage("");

        try {
            const response = await fetch("https://vocab-view-springboot.onrender.com/api/words", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    text: form.text,
                    partOfSpeech: form.partOfSpeech || null,
                    synonymReference: form.synonymReference || null,
                    antonymReference: form.antonymReference || null
                })
            });

            if (!response.ok) {
                throw new Error("Failed to add word");
            }

            setMessage("Word added successfully!");
            setForm({
                text: "",
                partOfSpeech: "",
                synonymReference: "",
                antonymReference: ""
            });
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="card">
            <h3 className="title">➕ Add New Word</h3>

            <div className="form-grid">
                <input
                    name="text"
                    placeholder="Word *"
                    value={form.text}
                    onChange={handleChange}
                />
                <input
                    name="partOfSpeech"
                    placeholder="Part of Speech"
                    value={form.partOfSpeech}
                    onChange={handleChange}
                />
                <input
                    name="synonymReference"
                    placeholder="Synonym Reference (optional)"
                    value={form.synonymReference}
                    onChange={handleChange}
                />
                <input
                    name="antonymReference"
                    placeholder="Antonym Reference (optional)"
                    value={form.antonymReference}
                    onChange={handleChange}
                />
            </div>

            <button className="primary" onClick={handleSubmit}>
                Add Word
            </button>

            {error && <p className="error">{error}</p>}
            {message && <p className="success">{message}</p>}
        </div>
    );
}