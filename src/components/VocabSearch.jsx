import { useState, useEffect } from "react";
import "./VocabSearch.css";
import WordListModal from "./WordListModal";
import { BASE_URL } from "../Api";

export default function VocabSearch() {
    const [word, setWord] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);

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

    return (
        <div className="container">
            <div className="card">
                <h2 className="title">📘 VocabView</h2>

                <div className="search-box autocomplete">
                    <input
                        type="text"
                        placeholder="Enter a word..."
                        value={word}
                        onChange={(e) => setWord(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                    <button onClick={() => handleSearch()}>Search</button>

                    {suggestions.length > 0 && (
                        <ul className="suggestions">
                            {suggestions.map((s) => (
                                <li
                                    key={s}
                                    onClick={() => {
                                        setWord(s);
                                        handleSearch(s);
                                    }}
                                >
                                    {s}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {loading && <p className="info">Loading...</p>}
                {error && <p className="error">{error}</p>}

                {result && (
                    <div className="result">
                        <div className="tables">
                            <Table title="Synonyms" data={result.synonyms} />
                            <Table title="Antonyms" data={result.antonyms} />
                        </div>
                    </div>
                )}
            </div>

            <button className="secondary" onClick={() => setShowModal(true)}>
                📋 View All Words
            </button>

            <WordListModal
                open={showModal}
                onClose={() => setShowModal(false)}
            />
        </div>
    );
}

function Table({ title, data }) {
    return (
        <div className="table-box">
            <h4>{title}</h4>
            {data.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>{title}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={item}>
                                <td>{index + 1}</td>
                                <td>{item}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="empty">No {title.toLowerCase()}</p>
            )}
        </div>
    );
}