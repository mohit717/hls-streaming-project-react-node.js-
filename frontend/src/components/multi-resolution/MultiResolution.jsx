import React, { useState } from "react";
import VideoSelector from "../VideoSelector";
import VideoPlayer from "../VideoPlayer";

const MultiResolution = () => {
  const [videoUrl, setVideoUrl] = useState("");

  // Function to handle video selection and update the video URL
  const handleSelectVideo = (videoName) => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(
      `http://localhost:5000/api/multi-res-video/${videoName}`,
      requestOptions
    )
      .then((response) => response.text())
      .then((url) => {
        setVideoUrl(url);
      })
      .catch((error) => console.error({ error }));
  };
  return (
    <div>
      <h4>MultiResolution</h4>

      <VideoSelector onSelectVideo={handleSelectVideo} />
      {videoUrl && (
        <div style={{ display: "flex", width: "100%" }}>
          <VideoPlayer videoUrl={`http://localhost:5000/${videoUrl}`} />
          <div style={{ width: "100%", border: "5px solid" }}></div>
        </div>
      )}
    </div>
  );
};

export default MultiResolution;
