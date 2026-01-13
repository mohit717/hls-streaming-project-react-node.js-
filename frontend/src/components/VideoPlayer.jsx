import React, { useEffect, useRef, useState } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

const videoJsOptions = {
  autoplay: false,
  controls: true,
  responsive: true,
  fluid: true,
};

const VideoPlayer = ({ videoUrl }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const videoElement = document.createElement("video-js");
    videoElement.classList.add("vjs-big-play-centered");

    if (videoRef.current) {
      videoRef.current.appendChild(videoElement);

      playerRef.current = videojs(videoElement, {
        controls: true,
        fluid: true,
        sources: [{ src: videoUrl, type: "application/x-mpegURL" }],
        // poster: posterSrc,
        ...videoJsOptions,
      });
    }

    return () => {
      if (playerRef.current && !playerRef.current.isDisposed()) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [videoUrl]);

  return (
    <div style={{ width: "100%", border: "5px solid" }}>
      <h5>Video.js Player</h5>
      {error && <p>{error}</p>}
      <div data-vjs-player style={{ width: "100%" }}>
        <div ref={videoRef} />
      </div>
    </div>
  );
};

export default VideoPlayer;
