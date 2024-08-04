import React from "react";
import videojs from "video.js";
import "video.js/dist/video-js.min.css";
import "videojs-vr";
import "./plugins";

interface props {
  options: {
    autoplay: boolean;
    controls: boolean;
    responsive: boolean;
    fluid: boolean;
    sources: {
      src: string;
      type: string;
    }[];
  };
  onReady: (player: any) => void;
}

const VideoJS = ({ options, onReady }: props) => {
  const videoRef = React.useRef(null);
  const playerRef: any = React.useRef(null);
  React.useEffect(() => {
    if (!playerRef.current) {
      const videoElement = videoRef.current;
      if (!videoElement) return;
      const player: any = (playerRef.current = videojs(
        videoElement,
        options,
        () => {
          player.vr({ projection: "360" });
          player.vrZoom();
          onReady && onReady(player);
        }
      ));
    }
  }, [onReady, options]);

  React.useEffect(() => {
    return () => {
      if (playerRef && playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  return (
    <div className="video-container" data-vjs-player>
      <video
        crossOrigin="anonymous"
        ref={videoRef}
        className="video-js vjs-big-play-centered"
      />
    </div>
  );
};

export default VideoJS;