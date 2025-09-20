import React, { useState } from 'react';
import { API_URL } from './config';

export default function UploadForm() {
  const [file, setFile] = useState(null);
  const [downloadURL, setDownloadURL] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sections, setSections] = useState(null);
  const [sessionId, setSessionId] = useState(null);

  // Handle ZIP upload
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setDownloadURL(null);
    setSections(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      // POST to backend /upload
      const res = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Upload failed');
      }

      const data = await res.json();
      // Save session ID for later parse call
      setSessionId(data.session_id);
      // Save download URL
      setDownloadURL(`${API_URL}${data.download_url}`);
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle parse call
  const handleParse = async () => {
    if (!sessionId) return;
    try {
      const res = await fetch(`${API_URL}/parse/${sessionId}`);
      if (!res.ok) {
        throw new Error('Parse failed');
      }
      const data = await res.json();
      setSections(data.sections);
    } catch (err) {
      console.error('Parse error:', err);
    }
  };

  return (
    <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6">
        HTML → WordPress Theme Converter
      </h1>

      {/* Upload Form */}
      <form onSubmit={handleUpload} className="flex flex-col gap-4">
        <input
          type="file"
          accept=".zip"
          onChange={(e) => setFile(e.target.files[0])}
          className="border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? 'Uploading…' : 'Upload ZIP'}
        </button>
      </form>

      {/* Download Link */}
      {downloadURL && (
        <a
          href={downloadURL}
          className="block mt-4 text-center bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          download
        >
          Download Dummy Theme
        </a>
      )}

      {/* Parse Button */}
      {sessionId && (
        <button
          onClick={handleParse}
          className="mt-4 w-full bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded"
        >
          Parse index.html Sections
        </button>
      )}

      {/* Display Parsed Sections */}
      {sections && (
        <div className="mt-4 bg-gray-50 border p-4 rounded max-h-80 overflow-auto text-xs">
          <h2 className="font-semibold mb-2">Parsed Sections:</h2>
          <pre className="whitespace-pre-wrap break-words">
            {JSON.stringify(sections, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
