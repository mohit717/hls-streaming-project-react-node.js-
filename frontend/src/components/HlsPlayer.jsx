import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

const HlsPlayer = ({ videoUrl }) => {
  const videoRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!videoUrl) return;

    setError(null);

    const handleError = (err) => {
      setError("Failed to load video. Please try again.");
    };

    if (Hls.isSupported()) {
      const hls = new Hls();

      hls.loadSource(videoUrl);
      hls.attachMedia(videoRef.current);
      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        console.log("Manifest loaded");
      });
      hls.on(Hls.Events.ERROR, handleError); // Handle HLS.js errors

      return () => {
        hls.destroy();
      };
    } else {
      if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
        videoRef.current.src = videoUrl;
      } else {
        handleError(); // If browser doesn't support HLS
      }
    }
  }, [videoUrl]);

  return (
    <div style={{ width: "100%", border: "5px solid" }}>
      <h5>HLS Player</h5>
      {error && <p>{error}</p>}
      <video ref={videoRef} controls style={{ width: "100%" }}>
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default HlsPlayer;
