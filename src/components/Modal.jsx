import ReactDOM from "react-dom";
import { useEffect, useState } from "react";
import aufs from "all-url-file-size";

const Modal = ({ e, downloadImage, modalToggle, downloadVideo, isVideo }) => {
  const [imageDimensions, setImageDimensions] = useState({
    width: "width",
    height: "height",
  });
  const [videoDimensions, setVideoDimensions] = useState({
    width: "width",
    height: "height",
  });
  const [imageSize, setImageSize] = useState("");
  const [videoSize, setVideoSize] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const loadImage = (imageUrl) => {
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      setImageDimensions({
        width: img.width,
        height: img.height,
      });
    };
    img.onerror = (err) => {
      console.log(err);
    };
    console.log("Load Image");
  };

  const loadVideo = (videoUrl) => {
    const video = document.createElement("video");
    video.src = videoUrl;

    video.addEventListener("loadedmetadata", () => {
      setVideoDimensions({
        width: video.videoWidth,
        height: video.videoHeight,
      });
    });

    video.addEventListener("error", (err) => {
      console.log(err);
    });
  };

  const getImageSize = async (imageUrl) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const sizeInBytes = blob.size;
      let size = (sizeInBytes / 1024).toFixed(2) + "KB";
      setImageSize(size);
      if (sizeInBytes > 1048576) {
        size = (sizeInBytes / 1048576).toFixed(2) + "MB";
        setImageSize(size);
      }
    } catch (error) {
      console.error("Error fetching image size:", error);
    }
  };
  const getVideoSize = (url) => {
    aufs(url, "mb")
      .then((size) => {
       setVideoSize(`${size.toFixed(2)} MB`)
      })
      .catch((error) => {
        console.error(`Error: ${error.message}`);
      });
  };

  function abc(src) {
    loadImage(src);
    getImageSize(src);
  }

  function def(src) {
    loadVideo(src);
    getVideoSize(src);
  }
  let imgDim =
    e.tags.length > 51
      ? e.tags.slice(0, 51) +
        "... (" +
        imageDimensions.width +
        "X" +
        imageDimensions.height +
        ") " +
        imageSize
      : e.tags +
        " (" +
        imageDimensions.width +
        "X" +
        imageDimensions.height +
        ") " +
        imageSize;
  let vidDim =
    e.tags.length > 51
      ? e.tags.slice(0, 51) +
        "... (" +
        videoDimensions.width +
        "X" +
        videoDimensions.height +
        ") " +
        videoSize
      : e.tags +
        " (" +
        videoDimensions.width +
        "X" +
        videoDimensions.height +
        ") " +
        videoSize;

  const download = (e) => {
    let waitingValue = isVideo ? 8000 : 2500;
    setIsDisabled(true);
    isVideo
      ? downloadVideo(e.videos.large.url, e.id)
      : downloadImage(e.webformatURL, e.id);
    setTimeout(() => {
      setIsDisabled(false);
    }, waitingValue);
  };

  useEffect(() => {
    isVideo ? def(e.videos.large.url) : abc(e.webformatURL);
  }, []);

  return ReactDOM.createPortal(
    <>
      {/* overlay  */}
      <div
        className="fixed bottom-0 left-0 right-0 top-0 z-10 bg-[#46424287]"
        onClick={modalToggle}
      ></div>
      <div className="fixed left-1/2 top-1/2 z-10  w-1/2 -translate-x-1/2 -translate-y-1/2 transform rounded-xl bg-[#1f1c1c] text-3xl font-bold text-black">
        {e.webformatURL !== undefined ? (
          <img
            src={e.webformatURL}
            alt={e.tags}
            loading="lazy"
            className="w-full object-cover"
            // onLoad={() => abc(e.webformatURL)}
          />
        ) : (
          <video
            src={e.videos.large.url}
            autoPlay
            muted
            loop
            playsInline
            controls
            className="w-full"
            // onLoadedMetadata={() => def(e.videos.large.url)}
          ></video>
        )}
        <div className="flex h-[75px] w-full items-center justify-between rounded-b-xl bg-[#0000002b] px-3 text-gray-400">
          <span className="text-sm">{isVideo ? vidDim : imgDim}</span>
          <div className="">
            <span
              className={`material-symbols-outlined cursor-pointer rounded-full px-2 py-1 text-xl ${!isDisabled && "hover:bg-[#1f1c1c] hover:text-gray-300"} ${isDisabled && "text-gray-700"}`}
              onClick={() =>
                !isDisabled ? download(e) : console.log("Disabled")
              }
            >
              download
            </span>
            <span
              className="material-symbols-outlined cursor-pointer rounded-full px-2 py-1 text-xl hover:bg-[#1f1c1c] hover:text-gray-300"
              onClick={modalToggle}
            >
              zoom_out
            </span>
          </div>
        </div>
      </div>
    </>,
    document.querySelector("#portal"),
  );
};
export default Modal;
