import { useEffect, useState } from "react";
import "./WordModal.css";

export default function WordListModal({ open, onClose }) {
    const [words, setWords] = useState([]);
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);

    const PAGE_SIZE = 8;

    useEffect(() => {
        if (!open) return;

        fetch("https://vocab-view-springboot.onrender.com/api/words")
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
        <div className="modal-backdrop">
            <div className="modal">
                <div className="modal-header">
                    <h3>📚 All Words</h3>
                    <button className="close" onClick={onClose}>✖</button>
                </div>

                <input
                    className="search"
                    placeholder="Search word..."
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setPage(1);
                    }}
                />

                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>Word</th>
                                <th>POS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginated.map(w => (
                                <tr key={w.word}>
                                    <td>{w.word}</td>
                                    <td>{w.partOfSpeech || "-"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {paginated.length === 0 && (
                        <p className="empty">No words found</p>
                    )}
                </div>

                <div className="pagination">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(p => p - 1)}
                    >
                        Prev
                    </button>

                    <span>{page} / {totalPages || 1}</span>

                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage(p => p + 1)}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}