import { useState } from "react";
import { AddWord } from "./components/AddWord";
import VocabSearch from "./components/VocabSearch";
import VocabWords from "./components/VocabWords";
import { Toaster } from "react-hot-toast";
import { AddVocabWord } from "./components/AddVocabWord";
import AddGrammarRule from "./components/AddGrammarRule";
import GrammarRulesList from "./components/GrammarRulesList";

function App() {
  const [activeTab, setActiveTab] = useState("list");

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#171717",
            color: "#fff",
            border: "1px solid #404040",
          },
        }}
      />

      <div className="min-h-screen bg-neutral-900 text-white p-4 flex flex-col items-center">
        {/* Tabs */}
        <div className="relative flex w-full max-w-2xl bg-neutral-800 rounded-xl shadow-lg overflow-hidden mb-6">

          <div
            className={`flex-1 text-center py-2 cursor-pointer transition-colors duration-300 ${activeTab === "list" ? "text-white font-semibold" : "text-gray-400"
              }`}
            onClick={() => setActiveTab("list")}
          >
            📚 Words
          </div>

          <div
            className={`flex-1 text-center py-2 cursor-pointer transition-colors duration-300 ${activeTab === "grammar" ? "text-white font-semibold" : "text-gray-400"
              }`}
            onClick={() => setActiveTab("grammar")}
          >
            🔍 Grammar
          </div>

          <div
            className={`flex-1 text-center py-2 cursor-pointer transition-colors duration-300 ${activeTab === "add" ? "text-white font-semibold" : "text-gray-400"
              }`}
            onClick={() => setActiveTab("add")}
          >
            ➕ Add
          </div>

          {/* Slider */}
          <div
            className="absolute bottom-0 left-0 h-1 w-1/3 bg-blue-500 rounded-full transition-all duration-300"
            style={{
              transform:
                activeTab === "list"
                  ? "translateX(0%)"
                  : activeTab === "grammar"
                    ? "translateX(100%)"
                    : "translateX(200%)",
            }}
          />
        </div>

        {/* Content */}
        <div className="w-full max-w-2xl">
          {activeTab === "list" && <VocabWords />}
          {activeTab === "grammar" && <GrammarRulesList />}
          {/* {activeTab === "search" && <VocabSearch />} */}
          {activeTab === "add" && (
            <div className="flex flex-col gap-6">
              <AddVocabWord />
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-neutral-700" />
                <span className="text-sm text-gray-400">Grammar</span>
                <div className="flex-1 h-px bg-neutral-700" />
              </div>
              <AddGrammarRule />
            </div>
          )}
          {/* {activeTab === "add" && <AddWord />} */}
        </div>
      </div>
    </>
  );
}

export default App;