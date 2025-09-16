import React, { useState } from "react";
import { Globe, Play, Loader2, Eye, Code } from "lucide-react";

export default function TestCaseGenerator() {
  const [url, setUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isFetchingResults, setIsFetchingResults] = useState(false);
  const [isLoadingScreenshot, setIsLoadingScreenshot] = useState(false);
  const [testCases, setTestCases] = useState([]);
  const [screenshot, setScreenshot] = useState(null);

  // 🔹 Call backend to generate tests
  const generateTestCases = async () => {
    if (!url) return;
    setIsGenerating(true);
    setIsFetchingResults(true);
    setTestCases([]);

    try {
      // Step 1: Trigger backend
      await fetch("http://localhost:5000/generate-tests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      // Step 2: Poll for results (wait until JSON is ready)
      let tests = [];
      for (let i = 0; i < 30; i++) {
        await new Promise((r) => setTimeout(r, 6000)); // wait 6s
        const res = await fetch(
          "http://localhost:5000/final_ai_test_results.json"
        );
        if (res.ok) {
          tests = await res.json();
          if (tests.length > 0) break;
        }
      }
      setTestCases(tests);
    } catch (err) {
      console.error("Error fetching test cases:", err);
      setTestCases([]);
    }

    setIsGenerating(false);
    setIsFetchingResults(false);
  };

  // 🔹 Fetch screenshot
  const fetchScreenshot = async () => {
    if (!url) return;
    setIsLoadingScreenshot(true);
    try {
      const res = await fetch("http://localhost:5000/capture-screenshot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!res.ok) throw new Error("Screenshot failed");
      const blob = await res.blob();
      setScreenshot(URL.createObjectURL(blob));
    } catch (err) {
      console.error("Screenshot error:", err);
      setScreenshot(null);
    }
    setIsLoadingScreenshot(false);
  };

  return (
    <div className="min-h-screen bg-[#807d7d] flex">
      {/* Sidebar */}
      <div className="w-80 bg-[#c6ccbc] border-r border-white/20 p-6">
        <h2 className="text-2xl font-bold text-[#1E201E] mb-2">
          Generate Test Cases
        </h2>
        <p className="text-[#1E201E] text-sm mb-6">
          Enter a website URL to preview & generate test cases
        </p>

        {/* URL Input */}
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          className="w-full mb-4 bg-white rounded-lg px-3 py-2 text-[#1E201E]"
        />

        {/* Screenshot Button */}
        <button
          onClick={fetchScreenshot}
          disabled={!url || isLoadingScreenshot}
          className="w-full bg-[#697565] text-white py-3 rounded-lg font-semibold hover:bg-[#4a5447] transition-all disabled:cursor-not-allowed flex items-center justify-center mb-6"
        >
          {isLoadingScreenshot ? "Loading Screenshot..." : "Preview Website"}
        </button>

        {/* Generate Button */}
        <button
          onClick={generateTestCases}
          disabled={!url || isGenerating}
          className="w-full bg-[#697565] text-white py-3 rounded-lg font-semibold hover:bg-[#4a5447] transition-all disabled:cursor-not-allowed flex items-center justify-center mb-6"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin inline" />
              Generating...
            </>
          ) : (
            <>
              <Play className="w-5 h-5 mr-2 inline" />
              Generate Test Cases
            </>
          )}
        </button>

        {/* Website Screenshot */}
        <div className="mt-6">
          <h3 className="text-[#1E201E] text-sm font-medium mb-2 flex items-center">
            <Eye className="w-4 h-4 mr-2" /> Website Preview
          </h3>
          {screenshot ? (
            <img
              src={screenshot}
              alt="Website Screenshot"
              className="w-full rounded-lg border border-white/20"
            />
          ) : (
            <div className="aspect-video bg-slate-600/50 rounded-lg flex items-center justify-center border-2 border-dashed border-white/20">
              <Globe className="w-8 h-8 text-white/50" />
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto bg-[#312e2e] ">
        {isFetchingResults ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-12 h-12 text-purple-400 animate-spin" />
          </div>
        ) : testCases.length === 0 ? (
          <div className="text-center text-white">
            <Code className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <p>No test cases yet. Enter a URL and click Generate.</p>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Generated {testCases.length} Test Cases
            </h2>
            <div className="space-y-4">
              {testCases.map((t, idx) => (
                <div
                  key={idx}
                  className="bg-slate-800 p-4 rounded-lg border border-white/20"
                >
                  <p className="text-purple-400">XPath: {t.xpath}</p>
                  <p className="text-green-400">Status: {t.status}</p>
                  {t.error && <p className="text-red-400">Error: {t.error}</p>}
                  <pre className="text-sm text-gray-300 overflow-x-auto">
                    {t.element_outerHTML}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
