import ReactDOM from "react-dom";
import { useState } from "react";

const Modal = ({ e, downloadImage, modalToggle }) => {
  const [imageDimensions, setImageDimensions] = useState({width:"width",height:"height"});
  const [imageSize, setImageSize] = useState("");
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
      console.error(err);
    };
  };

  const getImageSize = async (imageUrl) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const sizeInBytes = blob.size;
      const sizeInKilobytes = (sizeInBytes / 1024).toFixed(1) + "KB";
      setImageSize(sizeInKilobytes);
    } catch (error) {
      console.error("Error fetching image size:", error);
    }
  };

  function abc(src) {
    loadImage(src);
    getImageSize(src);
  }

  return ReactDOM.createPortal(
    <>
      {/* overlay  */}
      <div
        className="fixed bottom-0 left-0 right-0 top-0 z-10 bg-[#46424287]"
        onClick={modalToggle}
      ></div>
      <div className="fixed left-1/2 top-1/2 z-10 h-[474px] w-[640px] -translate-x-1/2 -translate-y-1/2 transform bg-[#1f1c1c] text-3xl font-bold text-black rounded-xl">
        <img
          src={e.webformatURL}
          alt={e.tags}
          loading="lazy"
          className="h-[84%] w-full object-cover"
          onLoad={abc(e.webformatURL)}
        />
        <div className="flex h-[16%] w-full items-center justify-between rounded-b-xl bg-[#0000002b] px-3 text-gray-400">
          <span className="text-sm">
            {e.tags.length > 51
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
                imageSize}
          </span>
          <div className="">
            <span
              className="material-symbols-outlined cursor-pointer rounded-full px-2 py-1 text-xl hover:bg-[#1f1c1c] hover:text-gray-300"
              onClick={() => {
                downloadImage(e.webformatURL, e.id);
              }}
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
