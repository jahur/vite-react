import React, { useState } from 'react';
import { API_URL } from './config';

export default function UploadForm() {
  const [file, setFile] = useState(null);
  const [downloadURL, setDownloadURL] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    setDownloadURL(`${API_URL}${data.download_url}`);
    setLoading(false);
  };

  return (
    <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6">HTML → WordPress Theme Converter</h1>
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
          {loading ? 'Converting…' : 'Convert Now'}
        </button>
      </form>
      {downloadURL && (
        <a
          href={downloadURL}
          className="block mt-4 text-center bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          download
        >
          Download Theme
        </a>
      )}
    </div>
  );
}
