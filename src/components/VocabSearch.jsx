import { useState } from "react";
import "./VocabSearch.css";
import WordListModal from "./WordListModal";

export default function VocabSearch() {
    const [word, setWord] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);

    const handleSearch = async () => {
        if (!word.trim()) return;

        setLoading(true);
        setError("");
        setResult(null);

        try {
            const response = await fetch(
                `http://localhost:8080/api/words/${word}`
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

                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Enter a word..."
                        value={word}
                        onChange={(e) => setWord(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                    <button onClick={handleSearch}>Search</button>
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