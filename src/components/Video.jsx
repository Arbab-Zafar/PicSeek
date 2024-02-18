import { useRef, useEffect, useState, memo } from "react";
// eslint-disable-next-line
const VideoComponent = ({src,autoPlay,muted,loop,playsInline,controls,classes}) => {
  console.log("Video component rendered");

  const videoRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1, // Trigger when 10% of the video is visible
      },
    );

    const currentVideoRef = videoRef.current; // Store the current value of the ref in a local variable

    if (currentVideoRef) {
      observer.observe(currentVideoRef);
    }

    return () => {
      if (currentVideoRef) {
        observer.unobserve(currentVideoRef);
      }
    };
  }, []);

  return (
    <video
      ref={videoRef}
      src={isVisible ? src : ""}
      autoPlay={autoPlay}
      muted={muted}
      loop={loop}
      playsInline={playsInline}
      controls={controls}
      className={classes}
    ></video>
  );
};

const Video = memo(VideoComponent);

export default Video;
