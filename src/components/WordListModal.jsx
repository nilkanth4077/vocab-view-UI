import { useEffect, useState } from "react";
import { BASE_URL } from "../Api";

export default function WordListModal({ open, onClose }) {
    const [words, setWords] = useState([]);
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);

    const PAGE_SIZE = 8;

    useEffect(() => {
        if (!open) return;

        fetch(`${BASE_URL}/words`)
            .then(res => res.json())
            .then(data => setWords(data))
            .catch(() => setWords([]));
    }, [open]);

    if (!open) return null;

    const filtered = words.filter(w =>
        w.word.toLowerCase().includes(query.toLowerCase())
    );

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const start = (page - 1) * PAGE_SIZE;
    const paginated = filtered.slice(start, start + PAGE_SIZE);

    return (
        <div className="fixed inset-0 bg-amber-50/30 flex items-center justify-center z-50">
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
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-white border-collapse">
                        <thead>
                            <tr className="border-b border-neutral-700">
                                <th className="py-2 px-3">Word</th>
                                <th className="py-2 px-3">POS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginated.map((w) => (
                                <tr
                                    key={w.word}
                                    className="border-b border-neutral-700 last:border-none hover:bg-neutral-800"
                                >
                                    <td className="py-2 px-3">{w.word}</td>
                                    <td className="py-2 px-3">{w.partOfSpeech || "-"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {paginated.length === 0 && (
                        <p className="text-center text-gray-400 mt-2">No words found</p>
                    )}
                </div>

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