import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../Api";

export default function VocabWords() {
    const [words, setWords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);

    useEffect(() => {
        fetchWords();
    }, []);

    const fetchWords = async () => {
        try {
            setLoading(true);
            const res = await axios.get(BASE_URL + "/vocab");
            console.log(res.data);
            setWords(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filteredWords = words.filter(w =>
        w.word.toLowerCase().includes(search.toLowerCase())
    );

    const suggestions =
        search.length > 0
            ? words.filter(w =>
                w.word.toLowerCase().startsWith(search.toLowerCase()) &&
                w.word.toLowerCase() !== search.toLowerCase()
            )
            : [];

    return (
        <div className="bg-neutral-800 rounded-xl shadow-lg p-5">
            <h2 className="text-xl font-bold mb-4">📚 All Vocabulary Words</h2>

            {loading && <p className="text-gray-400">Loading...</p>}

            {!loading && words.length === 0 && (
                <p className="text-gray-400">No words added yet.</p>
            )}

            <div className="relative mb-4">
                <input
                    type="text"
                    placeholder="Search word..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setShowSuggestions(true);
                    }}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                    onFocus={() => setShowSuggestions(true)}
                    className="w-full px-4 py-2 rounded-lg bg-neutral-900 border border-neutral-700 focus:outline-none focus:border-blue-500"
                />

                {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute z-10 w-full bg-neutral-900 border border-neutral-700 rounded-lg mt-1 max-h-48 overflow-y-auto">
                        {suggestions.map((s) => (
                            <div
                                key={s.id}
                                onClick={() => {
                                    setSearch(s.word);
                                    setShowSuggestions(false);
                                }}
                                className="px-4 py-2 cursor-pointer hover:bg-neutral-700 capitalize"
                            >
                                {s.word}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="space-y-4">
                {filteredWords.map((w) => (
                    <div
                        key={w.id}
                        className="bg-neutral-900 border border-neutral-700 rounded-lg p-4"
                    >
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-blue-400 capitalize">
                                {w.word}
                            </h3>
                            <span className="text-sm text-gray-400 capitalize">
                                {w.partOfSpeech}
                            </span>
                        </div>

                        <p className="mt-1">
                            <span className="text-green-400">Hindi:</span> {w.hindiMeaning}
                        </p>

                        <p className="capitalize">
                            <span className="text-yellow-400">Meaning:</span>{" "}
                            {w.englishMeaning}
                        </p>

                        {w.synonyms?.length > 0 && (
                            <p className="mt-1 capitalize">
                                <span className="text-purple-400">Synonyms:</span>{" "}
                                {w.synonyms.join(", ")}
                            </p>
                        )}

                        {w.examples?.length > 0 && (
                            <div className="mt-2">
                                <span className="text-cyan-400">Examples:</span>
                                <ul className="list-disc list-inside text-gray-300">
                                    {w.examples.map((ex, i) => (
                                        <li key={i}>{ex}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {w.hint && (
                            <p className="mt-2 text-sm text-gray-400 italic">
                                💡 Hint: {w.hint}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}