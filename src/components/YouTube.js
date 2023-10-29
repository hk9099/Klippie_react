import React, { useState } from 'react';

const VideoDownloader = () => {
  const [videoURL, setVideoURL] = useState('');
  const [customLink, setCustomLink] = useState('');

  const handleDownload = () => {
    window.location.href = `http://localhost:4000/download?URL=${videoURL}`;
  };

  const generateCustomLink = () => {
    fetch(`http://localhost:4000/custom-link?URL=${videoURL}`, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((json) => {
        setCustomLink(json.customLink);
      });
  };

  return (
    <div>
      <h1 className="heading">My Own YouTube Downloader !</h1>
      <input
        className="URL-input"
        placeholder="Video URL e.g. https://www.youtube.com/watch?v=MtN1YnoL46Q"
        value={videoURL}
        onChange={(e) => setVideoURL(e.target.value)}
      />
      <button className="convert-button" onClick={handleDownload}>
        Convert
      </button>
      <button className="convert-button" onClick={generateCustomLink}>
        Generate Custom Link
      </button>
      {customLink && (
        <p>
          Custom Link: <a href={customLink} target="_blank" rel="noopener noreferrer">{customLink}</a>
        </p>
      )}
    </div>
  );
};

export default VideoDownloader;
