import { useState } from "react";
import { AddWord } from "./components/AddWord";
import VocabSearch from "./components/VocabSearch";

function App() {
  const [activeTab, setActiveTab] = useState("search");

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-4 flex flex-col items-center">
      {/* Tabs */}
      <div className="relative flex w-full max-w-2xl bg-neutral-800 rounded-xl shadow-lg overflow-hidden mb-6">
        <div
          className={`flex-1 text-center py-2 cursor-pointer transition-colors duration-300 ${activeTab === "search" ? "text-white font-semibold" : "text-gray-400"
            }`}
          onClick={() => setActiveTab("search")}
        >
          🔍 Vocab Search
        </div>
        <div
          className={`flex-1 text-center py-2 cursor-pointer transition-colors duration-300 ${activeTab === "add" ? "text-white font-semibold" : "text-gray-400"
            }`}
          onClick={() => setActiveTab("add")}
        >
          ➕ Add Word
        </div>

        {/* Slider Indicator */}
        <div
          className={`absolute bottom-0 left-0 h-1 w-1/2 bg-blue-500 rounded-full transition-all duration-300`}
          style={{ transform: activeTab === "add" ? "translateX(100%)" : "translateX(0)" }}
        />
      </div>

      {/* Content */}
      <div className="w-full max-w-2xl">
        {activeTab === "search" && <VocabSearch />}
        {activeTab === "add" && <AddWord />}
      </div>
    </div>
  );
}

export default App;