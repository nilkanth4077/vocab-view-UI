import { useEffect, useState } from "react";
import { BASE_URL } from "../Api";

export default function GrammarRulesList() {
    const [rules, setRules] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchRules();
    }, []);

    const fetchRules = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${BASE_URL}/grammar`);
            const data = await res.json();
            setRules(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-neutral-800 rounded-xl shadow-lg p-4">
            <h2 className="text-xl font-bold mb-4 text-center">
                📘 Grammar Rules
            </h2>

            {loading && (
                <p className="text-gray-400 text-center">Loading...</p>
            )}

            {!loading && rules.length === 0 && (
                <p className="text-gray-400 text-center">
                    No grammar rules added yet.
                </p>
            )}

            <div className="space-y-4">
                {rules.map((r) => (
                    <div
                        key={r.id}
                        className="bg-neutral-900 border border-neutral-700 rounded-lg p-4"
                    >
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                            <h3 className="text-lg font-semibold text-blue-400">
                                {r.title}
                            </h3>
                            {r.category && (
                                <span className="text-sm text-gray-400">
                                    {r.category}
                                </span>
                            )}
                        </div>

                        {/* Description */}
                        {r.description && (
                            <p className="mt-2 text-gray-300">
                                {r.description}
                            </p>
                        )}

                        {/* Applies To */}
                        {r.appliesTo && (
                            <p className="mt-2">
                                <span className="text-yellow-400">
                                    Applies to:
                                </span>{" "}
                                <span className="capitalize">
                                    {r.appliesTo}
                                </span>
                            </p>
                        )}

                        {/* Correct / Wrong */}
                        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {r.correctForm && (
                                <div className="text-green-400">
                                    ✔ Correct:{" "}
                                    <span className="text-gray-300">
                                        {r.correctForm}
                                    </span>
                                </div>
                            )}
                            {r.wrongForm && (
                                <div className="text-red-400">
                                    ✖ Wrong:{" "}
                                    <span className="text-gray-300">
                                        {r.wrongForm}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Examples */}
                        {r.examples?.length > 0 && (
                            <div className="mt-3">
                                <span className="text-cyan-400">
                                    Examples:
                                </span>
                                <ul className="list-disc list-inside text-gray-300 mt-1">
                                    {r.examples.map((ex, i) => (
                                        <li key={i}>{ex}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Exceptions */}
                        {r.exceptions?.length > 0 && (
                            <div className="mt-3">
                                <span className="text-orange-400">
                                    Exceptions:
                                </span>
                                <ul className="list-disc list-inside text-gray-300 mt-1">
                                    {r.exceptions.map((ex, i) => (
                                        <li key={i}>{ex}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Hint */}
                        {r.hint && (
                            <p className="mt-3 text-sm italic text-gray-400">
                                💡 {r.hint}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}