import React, { useState } from 'react';
import { uploadPhoto } from './apiService';
import './MainContent.css';
import Results from './Results';

export default function MainContent() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (selectedFile) {
      try {
        setUploadStatus('Uploading...');
        const response = await uploadPhoto(selectedFile);
        console.log('File uploaded successfully:', response);
        setUploadStatus('Upload successful!');
      } catch (error) {
        console.error('Error uploading file:', error);
        setUploadStatus('Upload failed.');
      }
    } else {
      setUploadStatus('No file selected.');
    }
  };

  return (
    <main>
      <section id="activities" className="activities-section">
        <div className="activity">Run</div>
        <div className="activity">Walk</div>
        <div className="activity">Jog</div>
      </section>

      <section id="upload" className="upload-section">
        <div className="upload-image">
          <img src="newyork_coffeerun.webp" alt="Running Event" />
        </div>
        <div className="upload-info">
          <h2>RUN TO WIN A COFFEE</h2>
          <p>Submit your best running photo! Stand a chance to win a gift card.</p>
          <p>Random Drawing. Terms & Conditions Apply.</p>
          <input type="file" onChange={handleFileChange} />
          <button onClick={handleUpload}>UPLOAD YOUR PICTURE</button>
          {uploadStatus && <p>{uploadStatus}</p>}
        </div>
      </section>

      <section id="results" className="results-section">
        <Results />
      </section>
    </main>
  );
}
