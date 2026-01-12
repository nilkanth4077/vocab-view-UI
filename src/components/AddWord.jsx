import { useState } from "react";
import { BASE_URL } from "../Api";

export function AddWord() {
    const [form, setForm] = useState({
        words: "",
        partOfSpeech: "",
        synonymReference: "",
        antonymReference: ""
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const parseWords = (input) => {
        return input
            .split(/[\n,]+/)
            .map(w => w.trim().toLowerCase())
            .filter(Boolean);
    };

    const handleSubmit = async () => {

        const wordsList = parseWords(form.words);

        if (wordsList.length === 0) {
            setError("At least one word is required");
            return;
        }

        setError("");
        setMessage("");
        setLoading(true);

        try {
            const response = await fetch(`${BASE_URL}/words`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    words: wordsList,
                    partOfSpeech: form.partOfSpeech || null,
                    synonymReference: form.synonymReference || null,
                    antonymReference: form.antonymReference || null
                })
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(text || "Failed to add words");
            }

            setMessage(
                wordsList.length === 1
                    ? "Word added successfully!"
                    : `${wordsList.length} words added successfully!`
            );

            setForm({
                words: "",
                partOfSpeech: "",
                synonymReference: "",
                antonymReference: ""
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-neutral-900 rounded-xl shadow-xl p-5 max-w-2xl mx-auto flex flex-col gap-4 border-2 border-neutral-700">
            {/* Title */}
            <h3 className="text-xl font-bold text-white text-center">Add Word(s)</h3>

            {/* Form Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Words textarea */}
                <textarea
                    name="words"
                    placeholder="Enter word(s) — comma or new line separated *"
                    value={form.words}
                    onChange={handleChange}
                    rows={4}
                    className="col-span-1 sm:col-span-2 w-full p-3 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                {/* Part of Speech */}
                <input
                    name="partOfSpeech"
                    placeholder="Part of Speech"
                    value={form.partOfSpeech}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                {/* Synonym Reference */}
                <input
                    name="synonymReference"
                    placeholder="Synonym Reference (optional)"
                    value={form.synonymReference}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                {/* Antonym Reference */}
                <input
                    name="antonymReference"
                    placeholder="Antonym Reference (optional)"
                    value={form.antonymReference}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Submit Button */}
            <button
                className="relative flex items-center justify-center w-full py-3 bg-blue-600 text-white font-semibold rounded-xl shadow-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSubmit}
                disabled={loading}
            >
                {loading ? (
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                    "Add Word(s)"
                )}
            </button>

            {/* Messages */}
            {error && <p className="text-red-500 text-center mt-2">{error}</p>}
            {message && <p className="text-green-500 text-center mt-2">{message}</p>}
        </div>
    );
}