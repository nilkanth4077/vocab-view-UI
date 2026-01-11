import { useState } from "react";
import "./VocabSearch.css";

export default function VocabSearch() {
    const [word, setWord] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSearch = async () => {
        if (!word.trim()) return;

        setLoading(true);
        setError("");
        setResult(null);

        try {
            const response = await fetch(
                `http://localhost:8080/api/words/${word}/relations`
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
                <h2 className="title">📘 Vocabulary App</h2>

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
                        <h3 className="word-title">{result.word}</h3>

                        <div className="tables">

                            <div className="table-box">
                                <h4>Synonyms</h4>
                                {result.synonyms.length > 0 ? (
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Synonyms</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {result.synonyms.map((syn, index) => (
                                                <tr key={syn}>
                                                    <td>{index + 1}</td>
                                                    <td>{syn}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p className="empty">No synonyms</p>
                                )}
                            </div>

                            <div className="table-box">
                                <h4>Antonyms</h4>
                                {result.antonyms.length > 0 ? (
                                    <table className="antonym">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Antonyms</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {result.antonyms.map((ant, index) => (
                                                <tr key={ant}>
                                                    <td>{index + 1}</td>
                                                    <td>{ant}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p className="empty">No antonyms</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}