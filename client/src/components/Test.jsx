import React, { useState } from "react";
import {
  Globe,
  Play,
  Download,
  Copy,
  Check,
  Loader2,
  Eye,
  Code,
  Settings,
} from "lucide-react";

export default function TestCaseGenerator() {
  const [url, setUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isFetchingResults, setIsFetchingResults] = useState(false); // NEW
  const [isLoadingScreenshot, setIsLoadingScreenshot] = useState(false);
  const [testCases, setTestCases] = useState([]);
  const [screenshot, setScreenshot] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [activeTab, setActiveTab] = useState("visual");

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

      // Step 2: Poll for results
      let testCases = [];
      for (let i = 0; i < 30; i++) {
        // try for ~180s
        await new Promise((r) => setTimeout(r, 6000)); // wait 6s
        const res = await fetch(
          "http://localhost:5000/final_ai_test_results.json"
        );
        if (res.ok) {
          testCases = await res.json();
          if (testCases.length > 0) break;
        }
      }

      setTestCases(testCases);
    } catch (err) {
      console.error("Error fetching test cases:", err);
      setTestCases([]);
    }

    setIsGenerating(false);
    setIsFetchingResults(false);
  };

  const copyToClipboard = (code, index) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const downloadTestSuite = () => {
    const testSuite = testCases.map((test) => test.code).join("\n\n");
    const blob = new Blob([testSuite], { type: "text/javascript" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "test-suite.spec.js";
    a.click();
  };

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
      const imgUrl = URL.createObjectURL(blob);
      setScreenshot(imgUrl);
    } catch (err) {
      console.error("Screenshot error:", err);
      setScreenshot(null);
    }
    setIsLoadingScreenshot(false);
  };

  return (
    <div className="min-h-screen bg-[#807d7d] flex">
      {/* Left Sidebar */}
      <div className="w-80 bg-[#c6ccbc] border-r border-white/20 p-6 overflow-y-auto">
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-6"></div>
          <h2 className="text-2xl font-bold text-[#1E201E] mb-2">
            Generate Test Cases
          </h2>
          <p className="text-[#1E201E] text-sm">
            Enter a website URL to generate test cases & preview it.
          </p>
        </div>

        {/* URL Input */}
        <div className="mb-6">
          <label className="block text-[#1E201E] text-sm font-medium mb-3">
            Website URL
          </label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="w-full bg-white border-white/20 rounded-lg pl-3 pr-3 py-3 text-[#1E201E] placeholder-white/200"
          />
        </div>

        {/* Preview Button */}
        <button
          onClick={fetchScreenshot}
          disabled={!url || isLoadingScreenshot}
          className="w-full bg-[#697565] text-white py-2 rounded-lg font-semibold pl-3 pr-3 hover:bg-[#4a5447] transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-4"
        >
          {isLoadingScreenshot ? "Loading Screenshot..." : "Preview Website"}
        </button>
      </div>

      {/* Generate Button */}
      <button
        onClick={generateTestCases}
        disabled={!url || isGenerating}
        className="w-full bg-[#697565] text-white py-3 rounded-lg font-semibold hover:bg-[#4a5447] transition-all disabled:cursor-not-allowed flex items-center justify-center mb-6"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Play className="w-5 h-5 mr-2" />
            Generate Test Cases
          </>
        )}
      </button>

      {/* Website Screenshot Preview */}
      <div className="bg-slate-700/30 rounded-lg p-4 border border-white/20">
        <h3 className="text-white text-sm font-medium mb-3 flex items-center">
          <Eye className="w-4 h-4 mr-2" />
          Website Preview
        </h3>

        {isLoadingScreenshot ? (
          <div className="aspect-video bg-slate-600/50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-8 h-8 text-purple-400 mx-auto mb-2 animate-spin" />
              <p className="text-white/60 text-sm">Loading preview...</p>
            </div>
          </div>
        ) : screenshot ? (
          <div className="aspect-video bg-slate-600/50 rounded-lg overflow-hidden">
            <img
              src={screenshot}
              alt="Website Screenshot"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src =
                  'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="320" height="240" viewBox="0 0 320 240"><rect width="320" height="240" fill="%23374151"/><text x="160" y="120" font-family="Arial" font-size="14" fill="%239CA3AF" text-anchor="middle">Website Preview</text></svg>';
              }}
            />
          </div>
        ) : (
          <div className="aspect-video bg-slate-600/50 rounded-lg flex items-center justify-center border-2 border-dashed border-white/20">
            <div className="text-center">
              <Globe className="w-8 h-8 text-white/50 mx-auto mb-2" />
              <p className="text-white/60 text-sm">Preview will appear here</p>
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        {isFetchingResults ? (
          // 🔄 Loading screen
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">
                Generating Tests...
              </h3>
              <p className="text-white/70">
                Please wait while we analyze{" "}
                <span className="text-purple-400">{url}</span>
              </p>
            </div>
          </div>
        ) : testCases.length === 0 ? (
          // Idle screen
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Code className="w-12 h-12 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Ready to Generate Tests
              </h3>
              <p className="text-white/70 mb-6">
                Enter a website URL in the sidebar and click "Generate Test
                Cases" to get started with AI-powered test automation.
              </p>
            </div>
          </div>
        ) : (
          // Generated results
          <div className="p-8">
            {/* TODO: replace with real rendering of testCases */}
            <h2 className="text-3xl font-bold text-white mb-6">
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
