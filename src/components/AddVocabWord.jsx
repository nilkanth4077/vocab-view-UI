import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { BASE_URL } from "../Api";

export function AddVocabWord() {
    const [form, setForm] = useState({
        word: "",
        partOfSpeech: "",
        hindiMeaning: "",
        englishMeaning: "",
        examples: [""],
        synonyms: [""],
        hint: ""
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleArrayChange = (index, field, value) => {
        const updated = [...form[field]];
        updated[index] = value;
        setForm({ ...form, [field]: updated });
    };

    const addField = (field) => {
        setForm({ ...form, [field]: [...form[field], ""] });
    };

    const removeField = (field, index) => {
        const updated = form[field].filter((_, i) => i !== index);
        setForm({ ...form, [field]: updated });
    };

    const handleSubmit = async () => {
        if (!form.word.trim()) {
            toast.error("Word is required");
            return;
        }

        try {
            setLoading(true);

            const payload = {
                ...form,
                examples: form.examples.filter(Boolean),
                synonyms: form.synonyms.filter(Boolean)
            };

            await axios.post(BASE_URL + "/vocab", payload);
            toast.success("Word added successfully!");

            setForm({
                word: "",
                partOfSpeech: "",
                hindiMeaning: "",
                englishMeaning: "",
                examples: [""],
                synonyms: [""],
                hint: ""
            });

        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to add word");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-neutral-800 p-5 rounded-xl shadow-lg w-full">
            <h2 className="text-xl font-bold mb-4 text-center">➕ Add Vocabulary Word</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Word */}
                <div>
                    <label className="text-sm text-gray-400">Word *</label>
                    <input
                        name="word"
                        value={form.word}
                        onChange={handleChange}
                        placeholder="Enter word"
                        className="w-full mt-1 p-2 rounded-lg bg-neutral-900 border border-neutral-700 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>

                {/* POS */}
                <div>
                    <label className="text-sm text-gray-400">Part of Speech</label>
                    <select
                        name="partOfSpeech"
                        value={form.partOfSpeech}
                        onChange={handleChange}
                        className="w-full mt-1 p-2 rounded-lg bg-neutral-900 border border-neutral-700 focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        <option value="">Select POS</option>
                        <option value="noun">Noun</option>
                        <option value="verb">Verb</option>
                        <option value="adjective">Adjective</option>
                        <option value="adverb">Adverb</option>
                        <option value="pronoun">Pronoun</option>
                        <option value="preposition">Preposition</option>
                        <option value="conjunction">Conjunction</option>
                        <option value="interjection">Interjection</option>
                    </select>
                </div>

                {/* Hindi Meaning */}
                <div className="md:col-span-2">
                    <label className="text-sm text-gray-400">Hindi Meaning</label>
                    <textarea
                        name="hindiMeaning"
                        value={form.hindiMeaning}
                        onChange={handleChange}
                        rows="2"
                        placeholder="हिंदी अर्थ"
                        className="w-full mt-1 p-2 rounded-lg bg-neutral-900 border border-neutral-700 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>

                {/* English Meaning */}
                <div className="md:col-span-2">
                    <label className="text-sm text-gray-400">English Meaning</label>
                    <textarea
                        name="englishMeaning"
                        value={form.englishMeaning}
                        onChange={handleChange}
                        rows="2"
                        placeholder="English meaning"
                        className="w-full mt-1 p-2 rounded-lg bg-neutral-900 border border-neutral-700 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>

                {/* Examples */}
                <div className="md:col-span-2">
                    <label className="text-sm text-gray-400">Examples</label>

                    {form.examples.map((ex, i) => (
                        <div key={i} className="flex gap-2 mt-2">
                            <input
                                value={ex}
                                onChange={(e) =>
                                    handleArrayChange(i, "examples", e.target.value)
                                }
                                placeholder={`Example ${i + 1}`}
                                className="flex-1 p-2 rounded-lg bg-neutral-900 border border-neutral-700 focus:ring-2 focus:ring-blue-500 outline-none"
                            />

                            {form.examples.length > 1 && (
                                <button
                                    onClick={() => removeField("examples", i)}
                                    className="px-3 rounded-lg bg-red-500 hover:bg-red-600"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    ))}

                    <button
                        onClick={() => addField("examples")}
                        className="mt-2 text-sm text-blue-400 hover:underline"
                    >
                        + Add Example
                    </button>
                </div>

                {/* Synonyms */}
                <div className="md:col-span-2">
                    <label className="text-sm text-gray-400">Synonyms</label>

                    {form.synonyms.map((syn, i) => (
                        <div key={i} className="flex gap-2 mt-2">
                            <input
                                value={syn}
                                onChange={(e) =>
                                    handleArrayChange(i, "synonyms", e.target.value)
                                }
                                placeholder={`Synonym ${i + 1}`}
                                className="flex-1 p-2 rounded-lg bg-neutral-900 border border-neutral-700 focus:ring-2 focus:ring-blue-500 outline-none"
                            />

                            {form.synonyms.length > 1 && (
                                <button
                                    onClick={() => removeField("synonyms", i)}
                                    className="px-3 rounded-lg bg-red-500 hover:bg-red-600"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    ))}

                    <button
                        onClick={() => addField("synonyms")}
                        className="mt-2 text-sm text-blue-400 hover:underline"
                    >
                        + Add Synonym
                    </button>
                </div>

                {/* Hint */}
                <div className="md:col-span-2">
                    <label className="text-sm text-gray-400">Hint</label>
                    <input
                        name="hint"
                        value={form.hint}
                        onChange={handleChange}
                        placeholder="Short memory hint"
                        className="w-full mt-1 p-2 rounded-lg bg-neutral-900 border border-neutral-700 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
            </div>

            {/* Submit */}
            <button
                disabled={loading}
                onClick={handleSubmit}
                className="mt-6 w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition disabled:opacity-50"
            >
                {loading ? "Saving..." : "Save Word"}
            </button>
        </div>
    );
}