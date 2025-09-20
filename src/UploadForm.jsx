import React, { useState } from 'react';
import { API_URL } from './config';

export default function UploadForm() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [downloadURL, setDownloadURL] = useState(null);
  const [downloadName, setDownloadName] = useState('');

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setStatus('Uploading and converting…');
    setDownloadURL(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Upload/conversion failed');
      }

      // Receive the zip file as blob
      const blob = await res.blob();
      const blobURL = window.URL.createObjectURL(blob);

      setDownloadURL(blobURL);
      setDownloadName(file.name.replace('.zip', '_theme.zip'));
      setStatus('Conversion complete! Click below to download.');
    } catch (err) {
      console.error(err);
      setStatus('Error during upload/convert. Check console.');
    } finally {
      setLoading(false);
    }
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
          download={downloadName}
          className="block mt-4 text-center bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          Download WordPress Theme
        </a>
      )}
    </div>
  );
}
