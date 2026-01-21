import { useState, useEffect } from "react";
import WordListModal from "./WordListModal";
import { BASE_URL } from "../Api";
import ReviseModal from "./ReviseModal";

export default function VocabSearch() {
    const [word, setWord] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [wordsCache, setWordsCache] = useState([]);
    const [wordData, setWordData] = useState(null);
    const [showReviseModal, setShowReviseModal] = useState(false);
    const [reviseLoading, setReviseLoading] = useState(false);

    useEffect(() => {
        const fetchAllWords = async () => {
            try {
                const res = await fetch(`${BASE_URL}/words`);
                const data = await res.json();
                setWordsCache(data);
            } catch (err) {
                console.error("Failed to fetch words for cache", err);
            }
        };

        fetchAllWords();
    }, []);

    useEffect(() => {
        if (word.length < 2) {
            setSuggestions([]);
            return;
        }

        const timeout = setTimeout(async () => {
            try {
                const res = await fetch(
                    `${BASE_URL}/words/suggest?q=${word}`
                );
                const data = await res.json();
                setSuggestions(data);
            } catch {
                setSuggestions([]);
            }
        }, 250); // debounce

        return () => clearTimeout(timeout);
    }, [word]);

    const handleSearch = async (searchWord = word) => {
        if (!searchWord.trim()) return;

        setLoading(true);
        setError("");
        setResult(null);
        setSuggestions([]);

        try {
            const response = await fetch(
                `${BASE_URL}/words/${searchWord}`
            );

            if (!response.ok) {
                throw new Error("Word not found");
            }

            const data = await response.json();
            setResult(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRevise = async () => {
        setReviseLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/words/revise`);
            const data = await res.json();
            setWordData(data);
            console.log(data);
            setShowReviseModal(true);
        } catch (err) {
            console.error(err);
        } finally {
            setReviseLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4 rounded-xl border-2 border-neutral-700">
            <div className="bg-neutral-900 rounded-xl shadow-xl p-5">
                <h2 className="text-center text-fuchsia-50 text-2xl font-bold mb-4">
                    📘 VocabView
                </h2>

                {/* Search */}
                <div className="relative flex flex-wrap gap-2">
                    <input
                        type="text"
                        placeholder="Enter a word..."
                        value={word}
                        onChange={(e) => setWord(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        className="flex-1 px-3 py-2 rounded-md bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <button
                        onClick={() => handleSearch()}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
                    >
                        Search
                    </button>

                    {/* Suggestions */}
                    {suggestions.length > 0 && (
                        <ul className="absolute top-full left-0 right-0 mt-1 bg-neutral-800 rounded-lg shadow-lg max-h-56 overflow-y-auto z-20">
                            {suggestions.map((s) => (
                                <li
                                    key={s}
                                    onClick={() => {
                                        setWord(s);
                                        handleSearch(s);
                                    }}
                                    className="px-4 py-2 cursor-pointer bg-neutral-800 hover:bg-neutral-700 capitalize text-white border-b border-neutral-700 last:border-none"
                                >
                                    {s}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Status */}
                {loading && (
                    <p className="text-center text-gray-400 mt-3">Loading...</p>
                )}

                {error && (
                    <p className="text-center text-red-500 mt-3">{error}</p>
                )}

                {/* Result */}
                {result && (
                    <div className="mt-6 grid grid-cols-2 gap-4">
                        <Table title="Synonyms" data={result.synonyms} />
                        <Table title="Antonyms" data={result.antonyms} />
                    </div>
                )}
            </div>

            {/* Footer Button */}
            <div className="mt-4 flex justify-between items-center mx-4">
                <button
                    className="py-2 px-6 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition"
                    onClick={() => setShowModal(true)}
                >
                    📋 View All Words
                </button>

                <button
                    className="py-2 px-6 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition flex items-center justify-center"
                    onClick={handleRevise}
                    disabled={reviseLoading}
                >
                    {reviseLoading ? (
                        <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                        "⏳ Revise"
                    )}
                </button>
            </div>

            <WordListModal
                open={showModal}
                onClose={() => setShowModal(false)}
                loading={loading}
            />

            <ReviseModal
                showReviseModal={showReviseModal}
                wordData={wordData}
                reviseLoading={reviseLoading}
                handleRevise={handleRevise}
                setShowReviseModal={setShowReviseModal}
            />

        </div>
    );
}

function Table({ title, data }) {
    return (
        <div className="bg-neutral-800 rounded-lg p-3 overflow-x-auto">
            <h4 className="font-semibold mb-2">{title}</h4>

            {data.length > 0 ? (
                <table className="w-full text-sm border-collapse">
                    {/* <thead>
                        <tr className="border-b border-neutral-700">
                            <th className="text-left py-1">#</th>
                            <th className="text-left py-1">{title}</th>
                        </tr>
                    </thead> */}
                    <tbody>
                        {[...data]
                            .sort((a, b) => a.localeCompare(b))
                            .map((item, index) => (
                                <tr
                                    key={item}
                                    className="border-b border-neutral-700 last:border-none"
                                >
                                    <td className="py-1">•</td>
                                    <td className="py-1 capitalize">{item}</td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            ) : (
                <p className="text-center text-gray-400">
                    No {title.toLowerCase()}
                </p>
            )}
        </div>
    );
}