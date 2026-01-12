export default function ReviseModal({
    showReviseModal,
    wordData,
    reviseLoading,
    handleRevise,
    setShowReviseModal
}) {
    if (!showReviseModal || !wordData) return null;

    return (
        <div className="fixed inset-0 bg-amber-50/30 flex items-center justify-center z-50 p-4">
            <div className="bg-neutral-900 p-6 rounded-xl max-w-md w-full relative">
                <button
                    className="absolute top-2 right-2 text-gray-400 hover:text-white"
                    onClick={() => setShowReviseModal(false)}
                >
                    ✖
                </button>

                <h2 className="text-2xl font-bold mb-2 text-white">
                    {wordData.word}
                </h2>

                <p className="italic text-gray-300 mb-4">
                    {wordData.partOfSpeech || "-"}
                </p>

                <div className="grid grid-cols-2 gap-4">
                    {/* Synonyms */}
                    <div className="bg-neutral-800 p-3 rounded-lg">
                        <h3 className="font-semibold mb-2 text-white">Synonyms</h3>
                        {wordData.synonyms?.length ? (
                            <table className="w-full text-sm">
                                <tbody>
                                    {wordData.synonyms.map((s, i) => (
                                        <tr key={s} className="border-b border-neutral-700 last:border-none">
                                            <td className="py-1 px-2">{i + 1}</td>
                                            <td className="py-1 px-2">{s}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="text-gray-400 text-center">No synonyms</p>
                        )}
                    </div>

                    {/* Antonyms */}
                    <div className="bg-neutral-800 p-3 rounded-lg">
                        <h3 className="font-semibold mb-2 text-white">Antonyms</h3>
                        {wordData.antonyms?.length ? (
                            <table className="w-full text-sm">
                                <tbody>
                                    {wordData.antonyms.map((a, i) => (
                                        <tr key={a} className="border-b border-neutral-700 last:border-none">
                                            <td className="py-1 px-2">{i + 1}</td>
                                            <td className="py-1 px-2">{a}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="text-gray-400 text-center">No antonyms</p>
                        )}
                    </div>
                </div>

                <button
                    className="mt-6 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl flex items-center justify-center disabled:opacity-60"
                    onClick={handleRevise}
                    disabled={reviseLoading}
                >
                    {reviseLoading ? (
                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                        "Next Word"
                    )}
                </button>
            </div>
        </div>
    );
}