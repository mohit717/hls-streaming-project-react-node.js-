import React, { useState } from 'react';

const VideoSelector = ({ onSelectVideo }) => {
  const [videoName, setVideoName] = useState();

  const handleChange = (e) => {
    setVideoName(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (videoName) {
      onSelectVideo(videoName);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <select onChange={handleChange} name="video" value={videoName}>
        <option value="">Select</option>
        <option value="bunny">Bunny</option>
      </select>
      <button type="submit">Load Video</button>
    </form>
  );
};

export default VideoSelector;
