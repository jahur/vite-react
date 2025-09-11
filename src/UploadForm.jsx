import { useState } from "react";

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
      const res = await fetch("http://localhost:8000/convert/", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.download_url) {
        setDownloadLink(`http://localhost:8000${data.download_url}`);
        setStatus("Conversion complete! Download your theme:");
      } else {
        setStatus("Error: " + JSON.stringify(data));
      }
    } catch (err) {
      console.error(err);
      setStatus("Something went wrong.");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "2rem" }}>
      <h2>HTML → WordPress Theme</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept=".zip"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button type="submit" style={{ display: "block", marginTop: "1rem" }}>
          Convert
        </button>
      </form>
      <p>{status}</p>
      {downloadLink && (
        <a href={downloadLink} target="_blank" rel="noreferrer">
          Download Theme
        </a>
      )}
    </div>
  );
}
