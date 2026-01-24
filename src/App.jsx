import { useState } from "react";
import { AddWord } from "./components/AddWord";
import VocabSearch from "./components/VocabSearch";
import VocabWords from "./components/VocabWords";
import { Toaster } from "react-hot-toast";
import { AddVocabWord } from "./components/AddVocabWord";

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
            className={`flex-1 text-center py-2 cursor-pointer transition-colors duration-300 ${activeTab === "search" ? "text-white font-semibold" : "text-gray-400"
              }`}
            onClick={() => setActiveTab("search")}
          >
            🔍 Search
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
                  : activeTab === "search"
                    ? "translateX(100%)"
                    : "translateX(200%)",
            }}
          />
        </div>

        {/* Content */}
        <div className="w-full max-w-2xl">
          {activeTab === "list" && <VocabWords />}
          {activeTab === "search" && <VocabSearch />}
          {activeTab === "add" && <AddVocabWord />}
          {/* {activeTab === "add" && <AddWord />} */}
        </div>
      </div>
    </>
  );
}

export default App;