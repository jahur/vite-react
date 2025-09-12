import React from 'react';
import UploadForm from './UploadForm';
import './index.css';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-200 to-blue-200">
      <UploadForm />
    </div>
  );
}
