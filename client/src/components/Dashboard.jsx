import { useState } from "react";

export default function Dashboard() {
  const [url, setUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleScreenshot = () => {
    if (!url) {
      alert("Enter a URL first.");
      return;
    }
    if (!/^https?:\/\//i.test(url)) {
      alert("Please enter a full URL starting with http:// or https://");
      return;
    }

    // show loading while image service responds
    setLoading(true);
    // image.thum.io will generate a screenshot
    const generated = `https://image.thum.io/get/width/1200/${encodeURIComponent(url)}`;
    setImageUrl(generated);

    // naive loading off after small delay — image will actually load via <img> onload/onerror
    setTimeout(() => setLoading(false), 800);
  };

  return (
    <div className="p-8 flex-1">
      <h2 className="text-2xl font-bold text-green-400 mb-4">Website Screenshot</h2>

      <div className="flex gap-0 max-w-2xl">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter full website URL (e.g., https://openai.com)"
          className="flex-1 p-3 rounded-l-lg bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          onClick={handleScreenshot}
          className="px-6 py-3 bg-green-500 text-black font-semibold rounded-r-lg hover:bg-green-400 transition"
        >
          {loading ? "Loading..." : "Get Screenshot"}
        </button>
      </div>

      {/* Preview */}
      {imageUrl && (
        <div className="mt-8 max-w-4xl">
          <h3 className="text-lg text-green-300 mb-2">Preview</h3>
          <div className="rounded-xl border border-gray-700 overflow-hidden shadow-lg">
            <img
              src={imageUrl}
              alt="Website screenshot"
              className="w-full block"
              onLoad={() => {}}
              onError={() => alert("Failed to load screenshot. The external screenshot service may be unavailable.")}
            />
          </div>
        </div>
      )}
    </div>
  );
}
