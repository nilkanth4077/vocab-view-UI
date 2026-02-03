import { useState } from "react";
import { BASE_URL } from "../Api";
import toast from "react-hot-toast";

export default function AddGrammarRule() {
    const [form, setForm] = useState({
        title: "",
        category: "",
        description: "",
        appliesTo: "",
        correctForm: "",
        wrongForm: "",
        examples: "",
        exceptions: "",
        hint: ""
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const parseLines = (text) =>
        text
            .split("\n")
            .map(l => l.trim())
            .filter(Boolean);

    const handleSubmit = async () => {
        if (!form.title || !form.description) {
            toast.error("Title and Description are required");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(`${BASE_URL}/grammar`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: form.title,
                    category: form.category || null,
                    description: form.description,
                    appliesTo: form.appliesTo || null,
                    correctForm: form.correctForm || null,
                    wrongForm: form.wrongForm || null,
                    examples: parseLines(form.examples),
                    exceptions: parseLines(form.exceptions),
                    hint: form.hint || null
                })
            });

            if (!res.ok) throw new Error();

            toast.success("Grammar rule added successfully");

            setForm({
                title: "",
                category: "",
                description: "",
                appliesTo: "",
                correctForm: "",
                wrongForm: "",
                examples: "",
                exceptions: "",
                hint: ""
            });
        } catch {
            toast.error("Failed to add grammar rule");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-neutral-900 border-2 border-neutral-700 rounded-xl shadow-xl p-5 w-full mx-auto">
            <h2 className="text-xl font-bold text-center mb-4 text-white">
                Add Grammar Rule
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Title */}
                <input
                    name="title"
                    placeholder="Rule Title *"
                    value={form.title}
                    onChange={handleChange}
                    className="md:col-span-2 w-full p-3 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:ring-2 focus:ring-blue-500"
                />

                {/* Category */}
                <input
                    name="category"
                    placeholder="Category (e.g. Subject-Verb Agreement)"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:ring-2 focus:ring-blue-500"
                />

                {/* Applies To */}
                <input
                    name="appliesTo"
                    placeholder="Applies To (each, every)"
                    value={form.appliesTo}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:ring-2 focus:ring-blue-500"
                />

                {/* Description */}
                <textarea
                    name="description"
                    placeholder="Rule Explanation *"
                    value={form.description}
                    onChange={handleChange}
                    rows={4}
                    className="md:col-span-2 w-full p-3 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:ring-2 focus:ring-blue-500"
                />

                {/* Correct Form */}
                <input
                    name="correctForm"
                    placeholder="Correct Form (singular verb)"
                    value={form.correctForm}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:ring-2 focus:ring-green-500"
                />

                {/* Wrong Form */}
                <input
                    name="wrongForm"
                    placeholder="Wrong Form (plural verb)"
                    value={form.wrongForm}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:ring-2 focus:ring-red-500"
                />

                {/* Examples */}
                <textarea
                    name="examples"
                    placeholder={`Examples (one per line)\nEach student is present\nEvery child likes sweets`}
                    value={form.examples}
                    onChange={handleChange}
                    rows={4}
                    className="md:col-span-2 w-full p-3 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:ring-2 focus:ring-cyan-500"
                />

                {/* Exceptions */}
                <textarea
                    name="exceptions"
                    placeholder={`Exceptions (optional)\nEach of the students is / are`}
                    value={form.exceptions}
                    onChange={handleChange}
                    rows={3}
                    className="md:col-span-2 w-full p-3 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:ring-2 focus:ring-yellow-500"
                />

                {/* Hint */}
                <input
                    name="hint"
                    placeholder="Hint (memory trick)"
                    value={form.hint}
                    onChange={handleChange}
                    className="md:col-span-2 w-full p-3 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:ring-2 focus:ring-purple-500"
                />
            </div>

            {/* Submit Button */}
            <button
                onClick={handleSubmit}
                disabled={loading}
                className="mt-5 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition disabled:opacity-50"
            >
                {loading ? "Saving..." : "Add Grammar Rule"}
            </button>
        </div>
    );
}