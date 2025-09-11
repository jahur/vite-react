import { useState } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "/api";

export default function UploadForm() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [downloadLink, setDownloadLink] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setStatus("Please select a zip file.");
      return;
    }
    setStatus("Uploading… converting…");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${API_BASE}/convert/`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.download_url) {
        const link =
          data.download_url.startsWith("http")
            ? data.download_url
            : `${API_BASE}${data.download_url}`;
        setDownloadLink(link);
        setStatus("✅ Conversion complete!");
      } else {
        setStatus("Error: " + JSON.stringify(data));
      }
    } catch (err) {
      console.error(err);
      setStatus("Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-blue-50">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center text-indigo-700 mb-6">
          HTML → WordPress Theme Converter
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="file"
            accept=".zip"
            onChange={(e) => setFile(e.target.files[0])}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
             file:rounded-full file:border-0
             file:text-sm file:font-semibold
             file:bg-indigo-50 file:text-indigo-700
             hover:file:bg-indigo-100"
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            Convert Now
          </button>
        </form>
        {status && (
          <p className="text-center text-gray-600 mt-4">{status}</p>
        )}
        {downloadLink && (
          <div className="mt-6 text-center">
            <a
              href={downloadLink}
              target="_blank"
              rel="noreferrer"
              className="inline-block bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              Download Theme
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
