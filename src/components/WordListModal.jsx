import { useEffect, useState } from "react";
import { BASE_URL } from "../Api";

export default function WordListModal({ open, onClose, loading }) {
    const [words, setWords] = useState([]);
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);

    const PAGE_SIZE = 12;

    useEffect(() => {
        if (!open) return;

        fetch(`${BASE_URL}/words`)
            .then(res => res.json())
            .then(data => setWords(data))
            .catch(() => setWords([]));
        console.log(words);
    }, [open]);

    if (!open) return null;

    const filtered = words.filter(w =>
        w.word.toLowerCase().includes(query.toLowerCase())
    );

    const sorted = [...filtered].sort((a, b) =>
        a.word.toLowerCase().localeCompare(b.word.toLowerCase())
    );

    const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
    const start = (page - 1) * PAGE_SIZE;
    const paginated = sorted.slice(start, start + PAGE_SIZE);

    return (
        <div className="fixed inset-0 bg-amber-50/30 flex items-center justify-center z-50 px-4">
            <div className="bg-neutral-900 rounded-xl shadow-xl w-full max-w-2xl p-5 flex flex-col gap-4">

                {/* Header */}
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white">📚 All Words</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-300 hover:text-white text-lg"
                    >
                        ✖
                    </button>
                </div>

                {/* Search */}
                <input
                    className="w-full px-3 py-2 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Search word..."
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setPage(1);
                    }}
                />

                {/* Table */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center mt-4 gap-2">
                        <p className="text-center text-gray-400 mt-2">
                            Loading...
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-white border-collapse border border-neutral-600">
                            <thead>
                                <tr className="bg-neutral-800">
                                    <th className="py-2 px-3 border border-neutral-700">Word</th>
                                    <th className="py-2 px-3 border border-neutral-700">Meaning</th>
                                    <th className="py-2 px-3 border border-neutral-700">POS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginated.map((w) => (
                                    <tr
                                        key={w.word}
                                        className="hover:bg-neutral-800"
                                    >
                                        <td className="py-2 px-3 border border-neutral-700 capitalize">{w.word}</td>
                                        <td className="py-2 px-3 border border-neutral-700 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">
                                            {w.meaning || "-"}
                                        </td>
                                        <td className="py-2 px-3 border border-neutral-700 capitalize">{w.partOfSpeech || "-"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {paginated.length === 0 && (
                            <p className="text-center text-gray-400 mt-2">Loading...</p>
                        )}
                    </div>
                )}

                {/* Pagination */}
                <div className="flex justify-center items-center gap-4 mt-2">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage((p) => p - 1)}
                        className="px-3 py-1 rounded-md bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition"
                    >
                        Prev
                    </button>

                    <span className="text-white">{page} / {totalPages || 1}</span>

                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage((p) => p + 1)}
                        className="px-3 py-1 rounded-md bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}