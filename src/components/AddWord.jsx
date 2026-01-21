import { useEffect, useState } from "react";
import { BASE_URL } from "../Api";
import toast from "react-hot-toast";

export function AddWord() {
    const [form, setForm] = useState({
        words: "",
        partOfSpeech: "",
        meaning: "",
        synonymReference: "",
        antonymReference: ""
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [cachedWords, setCachedWords] = useState([]);
    const [showSynRef, setShowSynRef] = useState(false);
    const [showAntRef, setShowAntRef] = useState(false);
    const [showWordSuggestions, setShowWordSuggestions] = useState(false);

    useEffect(() => {
        fetch(`${BASE_URL}/words`)
            .then(res => res.json())
            .then(data => setCachedWords(data))
            .catch(() => setCachedWords([]));
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const parseWords = (input) => {
        return input
            .split(/[\n,]+/)
            .map(w => w.trim().toLowerCase())
            .filter(Boolean);
    };

    const getLastToken = (text) => {
        const parts = text.split(/[\n,]+/);
        return parts[parts.length - 1].trim();
    };

    const replaceLastToken = (text, newWord) => {
        const parts = text.split(/([\n,]+)/); // keep delimiters
        for (let i = parts.length - 1; i >= 0; i--) {
            if (!/[\n,]+/.test(parts[i]) && parts[i].trim()) {
                parts[i] = " " + newWord;
                break;
            }
        }
        return parts.join("").replace(/\s+/g, " ");
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
                    meaning: form.meaning || null,
                    synonymReference: form.synonymReference || null,
                    antonymReference: form.antonymReference || null
                })
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(text || "Failed to add words");
            }

            toast.success(
                wordsList.length === 1
                    ? "Word added successfully"
                    : `${wordsList.length} words added successfully`
            );

            setCachedWords(prev => {
                const existing = new Set(prev.map(w => w.word));
                const added = wordsList
                    .filter(w => !existing.has(w))
                    .map(w => ({ word: w }));

                return [...prev, ...added];
            });

            setForm({
                words: "",
                partOfSpeech: "",
                meaning: "",
                synonymReference: "",
                antonymReference: ""
            });
        } catch (err) {
            toast.error("Failed to add word");
        } finally {
            setLoading(false);
        }
    };

    const getSuggestions = (value) => {
        if (!value) return [];

        return cachedWords
            .filter(w =>
                w.word.toLowerCase().startsWith(value.toLowerCase())
            )
            .slice(0, 6);
    };

    return (
        <div className="bg-neutral-900 rounded-xl shadow-xl p-5 max-w-2xl mx-auto flex flex-col gap-4 border-2 border-neutral-700">

            <h3 className="text-xl font-bold text-white text-center">Add Word(s)</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div className="relative col-span-1 sm:col-span-2">
                    <textarea
                        name="words"
                        placeholder="Enter word(s) — comma or new line separated *"
                        value={form.words}
                        rows={4}
                        onChange={(e) => {
                            handleChange(e);
                            setShowWordSuggestions(true);
                        }}
                        onBlur={() => setTimeout(() => setShowWordSuggestions(false), 150)}
                        className="w-full p-3 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    {/* Suggestions */}
                    {showWordSuggestions && (
                        <ul className="absolute z-20 w-full bg-neutral-800 border border-neutral-700 rounded-lg mt-1 max-h-40 overflow-y-auto">
                            {getSuggestions(getLastToken(form.words)).map((w) => (
                                <li
                                    key={w.word}
                                    className="px-3 py-2 hover:bg-neutral-700 cursor-pointer capitalize"
                                    onMouseDown={() => {
                                        setForm(f => ({
                                            ...f,
                                            words: replaceLastToken(f.words, w.word) + ", "
                                        }));
                                        setShowWordSuggestions(false);
                                    }}
                                >
                                    {w.word}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <input
                    name="partOfSpeech"
                    placeholder="Part of Speech"
                    value={form.partOfSpeech}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <textarea
                    name="meaning"
                    placeholder="Meaning (shared by all synonyms)"
                    value={form.meaning}
                    onChange={handleChange}
                    rows={3}
                    className="col-span-1 sm:col-span-2 w-full p-3 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <div className="relative">
                    <input
                        name="synonymReference"
                        placeholder="Synonym Reference (optional)"
                        value={form.synonymReference}
                        onChange={(e) => {
                            handleChange(e);
                            setShowSynRef(true);
                        }}
                        onBlur={() => setTimeout(() => setShowSynRef(false), 150)}
                        className="w-full p-3 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    {showSynRef && (
                        <ul className="absolute z-20 w-full bg-neutral-800 border border-neutral-700 rounded-lg mt-1 max-h-40 overflow-y-auto">
                            {getSuggestions(form.synonymReference).map(w => (
                                <li
                                    key={w.word}
                                    className="px-3 py-2 hover:bg-neutral-700 cursor-pointer capitalize"
                                    onMouseDown={() => {
                                        setForm(f => ({ ...f, synonymReference: w.word }));
                                        setShowSynRef(false);
                                    }}
                                >
                                    {w.word}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Antonym Reference */}
                <div className="relative">
                    <input
                        name="antonymReference"
                        placeholder="Antonym Reference (optional)"
                        value={form.antonymReference}
                        onChange={(e) => {
                            handleChange(e);
                            setShowAntRef(true);
                        }}
                        onBlur={() => setTimeout(() => setShowAntRef(false), 150)}
                        className="w-full p-3 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    {showAntRef && (
                        <ul className="absolute z-20 w-full bg-neutral-800 border border-neutral-700 rounded-lg mt-1 max-h-40 overflow-y-auto">
                            {getSuggestions(form.antonymReference).map(w => (
                                <li
                                    key={w.word}
                                    className="px-3 py-2 hover:bg-neutral-700 cursor-pointer capitalize"
                                    onMouseDown={() => {
                                        setForm(f => ({ ...f, antonymReference: w.word }));
                                        setShowAntRef(false);
                                    }}
                                >
                                    {w.word}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

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
        </div>
    );
}