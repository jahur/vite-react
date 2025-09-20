import React, { useState } from 'react';
import { API_URL } from './config';

export default function UploadForm() {
  const [file, setFile] = useState(null);
  const [downloadURL, setDownloadURL] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setStatus('Uploading zip…');

    const formData = new FormData();
    formData.append('file', file);

    try {
      // 1️⃣ Upload HTML zip
      const resUpload = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData,
      });
      const dataUpload = await resUpload.json();

      if (!dataUpload.session_id) {
        throw new Error('No session_id returned from upload');
      }
      const sessionId = dataUpload.session_id;

      // 2️⃣ Convert to WordPress theme
      setStatus('Converting to WordPress theme…');
      const resConvert = await fetch(`${API_URL}/convert/${sessionId}`);
      const dataConvert = await resConvert.json();

      if (!dataConvert.download_url) {
        throw new Error('No download_url returned from convert');
      }

      // 3️⃣ Build final download URL
      const themeDownloadURL = `${API_URL}${dataConvert.download_url}`;
      setDownloadURL(themeDownloadURL);
      setStatus('Conversion complete!');
    } catch (err) {
      console.error(err);
      setStatus('Error during upload/convert.');
    }

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
          disabled={loading}
        >
          {loading ? 'Processing…' : 'Convert Now'}
        </button>
      </form>

      {status && <p className="mt-4 text-center text-gray-700">{status}</p>}

      {downloadURL && (
        <a
          href={downloadURL}
          className="block mt-4 text-center bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          download
        >
          Download WordPress Theme
        </a>
      )}
    </div>
  );
}
