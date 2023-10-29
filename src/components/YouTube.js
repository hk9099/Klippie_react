// import React, { useState, useEffect } from 'react';
// import ytdl from 'ytdl-core';

// const VideoDownloader = () => {
//   const [videoURL, setVideoURL] = useState('');
//   const [customLink, setCustomLink] = useState('');
//   const [videoMetadata, setVideoMetadata] = useState(null);

//   const handleDownload = () => {
//     window.location.href = `http://localhost:4000/download?URL=${videoURL}`;
//   };

//   const generateCustomLink = () => {
//     fetch(`http://localhost:4000/custom-link?URL=${videoURL}`, {
//       method: 'GET',
//     })
//       .then((res) => res.json())
//       .then((json) => {
//         setCustomLink(json.customLink);
//       });

//     // Get video metadata for preview
//     ytdl.getInfo(videoURL, (err, info) => {
//       if (err) {
//         console.error(err);
//       } else {
//         setVideoMetadata(info);
//       }
//     });
//   };

//   useEffect(() => {
//     // Clear video metadata when the URL changes
//     setVideoMetadata(null);
//   }, [videoURL]);

//   return (
//     <div>
//       <h1 className="heading">My Own YouTube Downloader !</h1>
//       <input
//         className="URL-input"
//         placeholder="Video URL e.g. https://www.youtube.com/watch?v=MtN1YnoL46Q"
//         value={videoURL}
//         onChange={(e) => setVideoURL(e.target.value)}
//       />
//       <button className="convert-button" onClick={handleDownload}>
//         Convert
//       </button>
//       <button className="convert-button" onClick={generateCustomLink}>
//         Generate Custom Link
//       </button>
//       {customLink && (
//         <p>
//           Custom Link: <a href={customLink} target="_blank" rel="noopener noreferrer">{customLink}</a>
//         </p>
//       )}
//       {videoMetadata && (
//         <div>
//           <h2>Video Preview</h2>
//           <video width="320" height="240" controls>
//             <source src={videoMetadata.player_response.videoDetails.thumbnail.thumbnails[0].url} type="video/mp4" />
//           </video>
//         </div>
//       )}
//     </div>
//   );
// };

// export default VideoDownloader;
