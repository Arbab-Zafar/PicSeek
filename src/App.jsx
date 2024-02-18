// Importing
import { useState, useEffect, useRef, useCallback } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import { saveAs } from "file-saver";
import Modal from "./components/Modal";
import LoadingBar from "react-top-loading-bar";
import Video from "./components/Video";

//Demodata to pass as the default value of data state! If some error occur in the api then this
//demodata will act as data
let demoData = {
  total: 35467,
  totalHits: 500,
  hits: [
    {
      id: 3063284, // this is the unique id. we use it as a key
      pageURL:
        "https://pixabay.com/photos/rose-flower-petal-floral-noble-3063284/",
      type: "photo", // type of the image (photo, illustration, vector)
      tags: "blue, flower, petal", // tags of the image. we use it as a name
      previewURL:
        "https://cdn.pixabay.com/photo/2018/01/05/16/24/rose-3063284_150.jpg",
      previewWidth: 150,
      previewHeight: 99,
      // url of the image. we use it to show the images
      webformatURL:
        "https://hips.hearstapps.com/hmg-prod/images/close-up-of-purple-crocus-flowers-united-kingdom-uk-royalty-free-image-1674159456.jpg",
      webformatWidth: 640,
      webformatHeight: 426,
      largeImageURL:
        "https://pixabay.com/get/g02d839ccc2510cab4660e93308421a508f13c4c6f77e2e72283b55dbc593910e79444f8b2aef3fb70b177d684e5f167c9f678236fb448f43d7f2d9929ea2ff9c_1280.jpg",
      imageWidth: 6000,
      imageHeight: 4000,
      imageSize: 3574625,
      views: 1182867,
      downloads: 773327,
      collections: 1599,
      likes: 1723,
      comments: 346,
      user_id: 1564471,
      user: "anncapictures",
      userImageURL:
        "https://cdn.pixabay.com/user/2015/11/27/06-58-54-609_250x250.jpg",
    },
    {
      id: 887443,
      pageURL:
        "https://pixabay.com/photos/flower-life-yellow-flower-crack-887443/",
      type: "photo",
      tags: "flower, life, pink flower",
      previewURL:
        "https://cdn.pixabay.com/photo/2015/08/13/20/06/flower-887443_150.jpg",
      previewWidth: 150,
      previewHeight: 116,
      webformatURL:
        "https://i0.wp.com/beato.com.sg/wp-content/uploads/2022/06/Can-I-buy-flowers-the-day-before-scaled-1326x700.jpg",
      webformatWidth: 640,
      webformatHeight: 497,
      largeImageURL:
        "https://pixabay.com/get/g2cb4d5a42fb7215a2941112c5cccfa2ce9c5cae732c2657c86f2eb6320d17fc98a831c7bccb2eb7445be1e0f06b4520cd42cf3c1556483952fdfd84c943fc8ba_1280.jpg",
      imageWidth: 3867,
      imageHeight: 3005,
      imageSize: 2611531,
      views: 454535,
      downloads: 281604,
      collections: 1053,
      likes: 1373,
      comments: 239,
      user_id: 1298145,
      user: "klimkin",
      userImageURL:
        "https://cdn.pixabay.com/user/2017/07/18/13-46-18-393_250x250.jpg",
    },
    {
      id: 2295434,
      pageURL:
        "https://pixabay.com/photos/spring-bird-bird-tit-spring-blue-2295434/",
      type: "photo",
      tags: "butterfly, flower, white",
      previewURL:
        "https://cdn.pixabay.com/photo/2017/05/08/13/15/spring-bird-2295434_150.jpg",
      previewWidth: 150,
      previewHeight: 99,
      webformatURL:
        "https://hips.hearstapps.com/hmg-prod/images/gettyimages-1194330423-612x612-1612545493.jpg?crop=1xw:0.9011780104712042xh;center,top&resize=1200:*",
      webformatWidth: 640,
      webformatHeight: 426,
      largeImageURL:
        "https://pixabay.com/get/g39a9e95fa6b0853487dd3535f7cfe0b7a1b561b30071714bf40c500e3a8d4b9b04c2dce39bc1f759fc023151a4f49a50786795cb2f8ac5c901c46bec8340babe_1280.jpg",
      imageWidth: 5363,
      imageHeight: 3575,
      imageSize: 2938651,
      views: 870068,
      downloads: 525829,
      collections: 2462,
      likes: 2349,
      comments: 298,
      user_id: 334088,
      user: "JillWellington",
      userImageURL:
        "https://cdn.pixabay.com/user/2018/06/27/01-23-02-27_250x250.jpg",
    },
  ],
};

// importing API key from .env files
let API_KEY = import.meta.env.VITE_API_KEY; //api key for image
let API_KEY_VIDEO = import.meta.env.VITE_API_KEY_VIDEO; //api key for videos

function App() {
  //States
  const [amt, setAmt] = useState(15); //No of images/videos to be shown in one page
  const [imgType, setImgType] = useState("photo"); //Type of image/video like for image it is "photo",
  // "vector" etc. and for video it is "animation" and "film"
  const [order, setOrder] = useState("popular"); // Order - "Popular" and 'Latest'
  const [query, setQuery] = useState("flowers"); // Search value
  const [page, setPage] = useState(1); // Page varies from 1 to 14
  const [type, setType] = useState(1); // state to change the value of input tag of page changer (near line 443)
  const [showModal, setShowModal] = useState(false); // state to whether show the modal/popup when we zoom
  const [modalData, setModalData] = useState(null); // data to be passed in modal/popup
  const [data, setData] = useState(demoData); // Actual data of images/videos
  const [isVideo, setIsVideo] = useState(false); // state of whether we want to show images or videos
  const [progress, setProgress] = useState(0); // top progress bar
  const [isDisabled, setIsDisabled] = useState(false); // state to disable download btn after the
  // click it will be abled after the download is complete
  const [scrollValue, setScrollValue] = useState(0); // state of how much the website is scrolled vertically

  // All Refs
  const inpRef = useRef(); //input of page
  const videoTypeSelectRef = useRef(); // type select tag
  const videoOrderSelectRef = useRef(); // order select tag

  //Main function to fetch the data from API of pixabay

  const fetchData = async (query, imagetype, order) => {
    //set progress of progress bar
    setProgress(20);
    query = await query.replaceAll(" ", "+"); // if it is "yellow flower" then convert into "yellow+flower"
    let response = await fetch(
      isVideo
        ? API_KEY_VIDEO +
            `&q=${query}&video_type=${imagetype}&per_page=200&order=${order}`
        : API_KEY +
            `&q=${query}&image_type=${imagetype}&per_page=200&order=${order}`,
    );
    setProgress(40);
    let dataa = await response.json();
    setProgress(70);
    //Store the data in data "state"
    setData(dataa);
    setProgress(100);
  };

  const amtFunc = (e) => {
    //As the API requires it between 3 to 200
    if (e.target.value < 2) {
      e.target.value = 3;
      setAmt(3);
    } else if (e.target.value > 201) {
      e.target.value = 200;
      setAmt(200);
    } else {
      setAmt(e.target.value);
    }
  };

  const handlePageChange = (e) => {
    inpRef.current.blur(); // remove the focus from the input tag of page
    // if the value of input page tag is b/w 1 to the total no. of pages
    if (type > 0 && type <= Math.ceil(data.hits.length / amt)) {
      setPage(type);
    } else {
      if (e.target.value <= 0) {
        setType(1); // this is the value of input page tag
        setPage(1); // this is the main page state
      } else if (e.target.value > Math.ceil(data.hits.length / amt)) {
        setType(Math.ceil(data.hits.length / amt));
        setPage(Math.ceil(data.hits.length / amt));
      }
    }
  };

  const downloadImage = (src, name) => {
    setProgress(30);
    saveAs(src, `${name}.jpg`); // it is a function given by a module
    setProgress(100);
    setIsDisabled(false);
  };

  const downloadVideo = useCallback(async (src, name) => {
    setProgress(10);
    try {
      setProgress(25);
      const response = await fetch(src);
      setProgress(50);
      // convert into blob as the normal url of video opens the video in new tab
      const blob = await response.blob();
      setProgress(75);
      saveAs(blob, `${name}.mp4`); // func given by module
      setIsDisabled(false); // as the download is complete, make all the download btn abled/clickable
    } catch (error) {
      console.error("Error downloading video:", error);
    }
    setProgress(100);
  }, []);

  const download = (e) => {
    // it is the checkpoint. here we check which func to call. if isVideo is true then
    // call download func of video otherwise of image
    setIsDisabled(true);
    isVideo
      ? downloadVideo(e.videos.medium.url, e.id) //here e is the data coming from loop [data.hits[index]]
      : downloadImage(e.webformatURL, e.id);
  };

  const modalToggle = () => {
    setShowModal((prevState) => !prevState); // if true then make false, if false make it true
  };

  const handleModal = (e, downloadImage, modalToggle) => {
    setProgress(30);
    setModalData({ e, downloadImage, modalToggle, downloadVideo, isVideo }); // Store the data in state to be
    // passed as props to the modal/popup component
    modalToggle();
    setProgress(100);
  };

  const isVideoToggleButton = () => {
    setIsVideo((video) => !video); // toggle b/w image and video. Whether to show image or video
  };

  window.addEventListener("scroll", () => {
    //event listener to scroll
    setScrollValue(window.scrollY); // set scroll value. This is will decide
    // below whether to show the up to top btn or not
  });

  useEffect(() => {
    fetchData(query, imgType, order);
    // eslint-disable-next-line
  }, [imgType, order, isVideo]); //when any of the following value chnages then call the fetchdata function

  useEffect(() => {
    setType(page);
  }, [page]); //after the page is changed make sure that the "type" state is also
  // changed (value of input page tag). This is not so imp. func

  useEffect(() => {
    videoOrderSelectRef.current.value = "popular";
    setOrder("popular");
    if (isVideo === true) {
      videoTypeSelectRef.current.value = "all";
      setImgType("all");
    } else {
      videoTypeSelectRef.current.value = "photo";
      setImgType("photo");
    }
  }, [isVideo]); // after we toggle b/w image and video then make sure
  // that the select tags are reseted or show the top/beginning value

  return (
    // Main div
    <div className="bg-[#212529] text-white">
      {/*       Top loading bar */}
      <LoadingBar
        color="#f11946"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      {/*       Navbar component  */}
      <Navbar />
      {/* Controller Main Div  */}
      <div className="mt-5 w-full">
        {/* Search input and Done btn */}
        <div className="flex w-full items-center justify-center gap-5 px-[0.35rem] py-4 sm:gap-10">
          <div className="relative flex w-[70%] items-center sm:w-[50%]">
            {/*             Search Icon  */}
            <span className="material-symbols-outlined absolute left-[17px] top-[0.35rem] text-lg sm:top-auto sm:text-[1.35rem]">
              search
            </span>
            {/*             Search input tag  */}
            <input
              name="search"
              type="text"
              className="h-9 w-full rounded-3xl border-[1px] border-gray-600 bg-[#2c3034] py-4 pl-11 text-xs outline-none sm:py-5 sm:pl-12 sm:text-sm"
              placeholder="Search..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
              }}
              maxLength="100" // max length of characters as api don't allow more than 100
            />
          </div>
          {/*           Done btn  */}
          <button
            name="done btn"
            className="h-7 rounded-lg bg-[#2c3034] bg-gradient-to-r from-[#2c3034] to-[#1f1c1c] px-4 text-xs outline outline-1 outline-gray-400 transition-all duration-300 hover:outline-offset-2 active:translate-y-1 sm:h-9 sm:text-sm"
            onClick={() => fetchData(query, imgType, order)}
          >
            Done
          </button>
        </div>
        {/* Actual Controller, img/video type, amt, order, video/img toggle */}
        <div className="mt-0 flex w-full flex-wrap items-center justify-center gap-x-4 gap-y-3 p-1 sm:mt-4 sm:justify-around sm:gap-0 sm:p-0">
          {/*           Image/Video Type  */}
          <div className="space-x-1">
            <label
              htmlFor="imageType"
              className="text-[0.65rem] md:text-[0.9rem]"
            >
              {isVideo ? "Video Type " : "Image Type "}
            </label>
            <select
              name="imageTypeName"
              id="imageType"
              className="rounded-lg bg-[#2c3034] py-1 pl-2 text-[0.65rem] outline-none sm:pl-3 md:text-[0.9rem]"
              onChange={(e) => {
                setImgType(e.target.value);
              }}
              ref={videoTypeSelectRef}
            >
              <option value={isVideo ? "all" : "photo"}>
                {isVideo ? "All" : "Photo"}
              </option>
              <option value={isVideo ? "film" : "illustration"}>
                {isVideo ? "Film" : "Illustration"}
              </option>
              <option value={isVideo ? "animation" : "vector"}>
                {isVideo ? "Animation" : "Vector"}
              </option>
            </select>
          </div>
          {/*           Amount  */}
          <div className="space-x-1">
            <label htmlFor="amount" className="text-[0.65rem] md:text-[0.9rem]">
              Amount:{" "}
            </label>
            <input
              name="amountName"
              id="amount"
              type="number"
              min="3"
              max="200"
              className="rounded-lg bg-[#2c3034] py-1 pl-2 text-[0.65rem] outline-none sm:pl-3 md:text-[0.9rem]"
              value={amt}
              onChange={(e) => setAmt(e.target.value)}
              onBlur={amtFunc}
            />
          </div>
          {/*           Order  */}
          <div className="space-x-1">
            <label htmlFor="order" className="text-[0.65rem] md:text-[0.9rem]">
              Order:{" "}
            </label>
            <select
              name="orderName"
              id="order"
              className="rounded-lg bg-[#2c3034] px-2 py-1 text-[0.65rem] outline-none sm:px-3 md:text-[0.9rem]"
              onChange={(e) => {
                setOrder(e.target.value);
              }}
              ref={videoOrderSelectRef}
            >
              <option value="popular">Popular</option>
              <option value="latest">Latest</option>
            </select>
          </div>
          {/* Toggle button  */}
          <div className="flex items-center space-x-2">
            <span className="text-[0.65rem] md:text-[0.9rem]">Videos: </span>
            <div className="flex h-[1.6rem] w-fit items-center">
              <button
                name="toggleVideoBtn"
                className={`relative flex h-6 w-11 items-center rounded-full border border-gray-400 transition duration-300 ease-in-out focus:outline-none ${
                  isVideo ? "bg-[#1f1c1c]" : "bg-[#2c3034]"
                }`}
                onClick={isVideoToggleButton}
              >
                <span
                  className={`absolute left-[0.1rem] top-[50%] h-[1.2rem] w-5 -translate-y-[50%] transform rounded-full shadow-md transition duration-300 ease-in-out ${
                    isVideo ? "translate-x-[94%]" : ""
                  } ${isVideo ? "bg-green-200" : "bg-gray-400"}`}
                ></span>
              </button>
            </div>
          </div>
        </div>
        {/*         little suggestion or how to use  */}
        <div className="mt-2 flex items-center justify-center px-1 text-[0.49rem] text-gray-400 sm:text-[0.65rem] md:text-xs">
          <span className="text-center">
            After making the changes, click the &quot;Done&quot; button to load
            the images!
          </span>
        </div>
      </div>
      {/* Show Divs of images/videos */}
      <div className="mt-2 flex w-full flex-wrap justify-evenly gap-y-7 sm:mt-4">
        {/*         Map thorugh the data state */}
        {data.hits.length !== 0 ? (
          data.hits.slice((page - 1) * amt, amt * page).map((e) => {
            // slice the data (no of data
            // a to show in one page)
            return (
              <div
                className="h-[300px] w-[95%] rounded-xl border border-gray-700 sm:w-[45%] md:w-[30%]"
                key={e.id}
              >
                {e.webformatURL !== undefined ? (
                  <img
                    src={e.webformatURL}
                    alt={e.tags}
                    loading="lazy"
                    className="h-[84%] w-full rounded-t-xl object-cover hover:opacity-50"
                  />
                ) : (
                  // eslint-disable-next-line
                  <Video
                    src={e.videos.tiny.url}
                    autoPlay // autoplay the video
                    muted // mute the video(there is no audio before also)
                    loop // continously play the video
                    playsInline
                    controls // user can control the video, pause, mute, length etc
                    classes="h-[84%] w-full"
                  />
                )}
                <div className="flex h-[16%] w-full items-center justify-between rounded-b-xl bg-[#0000002b] px-3 text-gray-400">
                  <span className="text-[0.7rem] md:text-sm">
                    {e.tags.length >= 40 ? e.tags.slice(0, 37) + "..." : e.tags}
                  </span>
                  <div className="flex">
                    {/*                     Download icon  */}
                    <span
                      className={`material-symbols-outlined cursor-pointer rounded-full px-2 py-1 text-xl ${!isDisabled && "hover:bg-[#1f1c1c] hover:text-gray-300"} ${isDisabled && "text-gray-700"}`}
                      onClick={() => !isDisabled && download(e)}
                    >
                      download
                    </span>
                    {/*                     Zoom icon  */}
                    <span
                      className="material-symbols-outlined hidden cursor-pointer rounded-full px-2 py-1 text-xl hover:bg-[#1f1c1c] hover:text-gray-300 sm:block"
                      onClick={() => handleModal(e, downloadImage, modalToggle)}
                    >
                      zoom_in
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div>
            <span>No {isVideo ? "videos" : "images"} found!</span>
          </div>
        )}
      </div>
      {/*       Only show if there is more than 1 page  */}
      {Math.ceil(data.hits.length / amt) > 1 && (
        <div className="mx-auto mt-3 flex w-fit items-start space-x-5 sm:mt-9 sm:space-x-10">
          {/*           Previous page btn  */}
          <button
            name="prevbtn"
            className="flex items-center justify-center rounded-full px-2 py-1 pl-3 transition-all hover:bg-[#0000002b] active:translate-x-[0.2rem]"
            onClick={() => {
              setProgress(20);
              page > 1 && setPage((prevPage) => prevPage - 1);
              setProgress(100);
            }}
          >
            <span className="material-symbols-outlined text-sm sm:text-xl">
              arrow_back_ios
            </span>
          </button>
          <div>
            {/*             Input page btn to direct enter the page and navigate  */}
            <input
              name="pageName"
              id="pageInp"
              type="number"
              min="1"
              max={Math.ceil(data.hits.length / amt)}
              value={type}
              onChange={(e) => {
                setType(parseInt(e.target.value));
              }}
              onKeyDown={(e) => {
                e.key === "Enter" && handlePageChange();
              }}
              onBlur={(e) => handlePageChange(e)}
              ref={inpRef}
              className="w-[17px] bg-transparent pt-1 text-sm outline-none sm:w-[20px] sm:text-lg"
            />
            {/*             Out of page which is mostly 14 */}
            <label htmlFor="pageInp" className="pt-1 text-sm sm:text-lg">
              / {data !== null && Math.ceil(data.hits.length / amt)}
            </label>
          </div>
          {/*           Next page btn  */}
          <button
            name="nextBtn"
            className="flex items-center justify-center rounded-full px-2 py-1 pl-3 transition-all hover:bg-[#0000002b] active:translate-x-[0.2rem]"
            onClick={() => {
              setProgress(20);
              page < Math.ceil(data.hits.length / amt) &&
                setPage((prevPage) => prevPage + 1);
              setProgress(100);
            }}
          >
            <span className="material-symbols-outlined text-sm sm:text-xl">
              arrow_forward_ios
            </span>
          </button>
        </div>
      )}
      {/* Footer  */}
      <div className="mt-3 flex w-full flex-wrap items-center justify-center space-x-2 bg-[#1f1c1c] py-2 text-[0.65rem] sm:mt-4 sm:text-sm">
        <div className="my-1 flex items-center justify-center">
          <span className="mr-1 sm:mr-2">&copy; 2024 PicSeek.</span>
          <span>All rights reserved.</span>
        </div>
        <div className="my-1 flex flex-wrap items-center justify-center">
          <span className="mr-1">Designed & created by</span>
          <span className="font-bold">&#10024;Arbab Zafar&#10024; </span>
        </div>
        {/* <img src={developer} alt="developer" className="w-6 rounded-full" /> */}
        <div className="my-1 flex items-center space-x-4 px-3">
          <i
            className="fa-brands fa-instagram cursor-pointer text-[1rem] transition-all hover:text-gray-400 sm:text-[1.35rem]"
            onClick={() =>
              window.open("https://www.instagram.com/arbab.fr/", "_blank")
            }
          ></i>
          <i
            className="fa-brands fa-github cursor-pointer text-[1rem] transition-all hover:text-gray-400 sm:text-[1.35rem]"
            onClick={() =>
              window.open("https://github.com/Arbab-Zafar", "_blank")
            }
          ></i>
        </div>
      </div>
      {/*       Click to top btn */}
      <button
        name="toTopBtn"
        onClick={() => window.scrollTo(0, 0)}
        className={`fixed bottom-2 right-2 flex h-7 w-7 items-center justify-center rounded-full border border-gray-600 bg-[#2c3034] outline-none transition duration-300 ease-in-out xs:bottom-5 xs:right-5 xs:h-10 xs:w-10 ${scrollValue > 0 ? "z-20 opacity-100" : "z-0 cursor-default opacity-0"}`}
      >
        <span className="material-symbols-outlined text-sm xs:text-xl">
          arrow_upward
        </span>
      </button>
      {/* Show modal component  */}
      {showModal && <Modal {...modalData} />}
    </div>
  );
}

export default App;