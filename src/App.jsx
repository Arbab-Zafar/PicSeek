import { useState, useEffect, useRef } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import { saveAs } from "file-saver";
import Modal from "./components/Modal";
import developer from "./developer.jpg";
let demoData = {
  total: 35467,
  totalHits: 500,
  hits: [
    {
      id: 3063284,
      pageURL:
        "https://pixabay.com/photos/rose-flower-petal-floral-noble-3063284/",
      type: "photo",
      tags: "blue, flower, petal",
      previewURL:
        "https://cdn.pixabay.com/photo/2018/01/05/16/24/rose-3063284_150.jpg",
      previewWidth: 150,
      previewHeight: 99,
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

function App() {
  let API_KEY = import.meta.env.VITE_API_KEY;
  const [amt, setAmt] = useState(15);
  const [imgType, setImgType] = useState("photo");
  const [order, setOrder] = useState("popular");
  const [query, setQuery] = useState("flowers");
  const [page, setPage] = useState(1);
  const [type, setType] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [data, setData] = useState(demoData);

  const inpRef = useRef();

  const amtFunc = (e) => {
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

  const fetchData = async (query, imagetype, order) => {
    setPage(1);
    query = await query.replaceAll(" ", "+");
    let response = await fetch(
      API_KEY +
        `&q=${query}&image_type=${imagetype}&per_page=200&order=${order}`,
    );
    let data = await response.json();
    setData(data);
    console.log(data);
  };

  const btnClicked = () => {
    if (query === "") {
      alert("Search for the image!");
    } else {
      fetchData(query, imgType, order);
    }
  };

  const handlePageChange = (e) => {
    inpRef.current.blur();
    if (type > 0 && type <= Math.ceil(data.hits.length / amt)) {
      setPage(type);
      console.log("Inside if");
    } else {
      if (e.target.value <= 0) {
        setType(1);
        setPage(1);
      } else if (e.target.value > Math.ceil(data.hits.length / amt)) {
        setType(Math.ceil(data.hits.length / amt));
        setPage(Math.ceil(data.hits.length / amt));
      }
    }
  };

  const downloadImage = (src, name) => {
    console.log("Image src = ", src);
    saveAs(src, `${name}.jpg`);
  };

  const modalToggle = () => {
    console.log("Got triggered");
    setShowModal((prevState) => !prevState);
    console.log(showModal);

    // console.log("Inside modal toggle function");
    // console.log("showModal", showModal);
  };

  const handleModal = (e, downloadImage, modalToggle) => {
    setModalData({ e, downloadImage, modalToggle }); // Store the data in state
    modalToggle();
  };

  useEffect(() => {
    fetchData(query, imgType, order);
  }, []);

  useEffect(() => {
    setType(page);
    window.scrollTo(0, 0);
  }, [page]);
  return (
    <div className="bg-[#212529] text-white">
      <Navbar />
      {/* Controller  */}
      <div className="mt-5 w-full">
        {/* Search  */}
        <div className="flex w-full items-center justify-center gap-10 py-4">
          <div className="relative flex w-[50%] items-center">
            <span className="material-symbols-outlined absolute left-[17px]">
              search
            </span>
            <input
              type="text"
              className="h-9 w-full rounded-3xl border-[1px] border-gray-600 bg-[#2c3034] py-5 pl-12 text-sm outline-none"
              placeholder="Search..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
              }}
            />
          </div>
          <button
            className="h-9 rounded-lg bg-[#2c3034] bg-gradient-to-r from-[#2c3034] to-[#1f1c1c] px-4 text-sm outline outline-1 outline-gray-400 transition-all duration-300 hover:outline-offset-2 active:translate-y-1"
            onClick={btnClicked}
          >
            Done
          </button>
        </div>
        {/* dghsdgs */}
        <div className="mt-4 flex w-full justify-around">
          <div className="space-x-1">
            <span className="text-[0.9rem]">Image Type: </span>
            <select
              name="imageType"
              id="imageType"
              className="rounded-lg bg-[#2c3034] py-1 pl-3 text-[0.9rem] outline-none"
              onChange={(e) => {
                setImgType(e.target.value);
              }}
            >
              <option value="photo">Photo</option>
              <option value="illustration">Illustration</option>
              <option value="vector">Vector</option>
            </select>
          </div>
          <div className="space-x-1">
            <span className="text-[0.9rem]">Amount: </span>
            <input
              type="number"
              min="3"
              max="200"
              className="rounded-lg bg-[#2c3034] py-1 pl-3 text-[0.9rem] outline-none"
              value={amt}
              onChange={(e) => setAmt(e.target.value)}
              onBlur={amtFunc}
            />
          </div>
          <div className="space-x-1">
            <span className="text-[0.9rem]">Order: </span>
            <select
              name="imageType"
              id="imageType"
              className="rounded-lg bg-[#2c3034] px-3 py-1 text-[0.9rem] outline-none"
              onChange={(e) => {
                setOrder(e.target.value);
              }}
            >
              <option value="popular">Popular</option>
              <option value="latest">Latest</option>
            </select>
          </div>
        </div>
        <div className="mt-2 flex items-center justify-center text-xs text-gray-400">
          <span>
            After making the changes, click the &quot;Done&quot; button to load
            the images!
          </span>
        </div>
      </div>
      {/* Show Divs  */}
      <div className="mt-4 flex w-full flex-wrap justify-evenly gap-y-7">
        {data !== null
          ? data.hits.slice((page - 1) * amt, amt * page).map((e) => {
              return (
                <div
                  className="h-[300px] w-[30%] rounded-xl border border-gray-700"
                  key={e.id}
                >
                  <img
                    src={e.webformatURL}
                    alt={e.tags}
                    loading="lazy"
                    className="h-[84%] w-full rounded-t-xl object-cover hover:opacity-50"
                  />
                  <div className="flex h-[16%] w-full items-center justify-between rounded-b-xl bg-[#0000002b] px-3 text-gray-400">
                    <span className="text-sm">
                      {e.tags.length > 40
                        ? e.tags.slice(0, 37) + "..."
                        : e.tags}
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
                        onClick={() =>
                          handleModal(e, downloadImage, modalToggle)
                        }
                      >
                        zoom_in
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          : console.log("Data has not came")}
      </div>
      {Math.ceil(data.hits.length / amt) > 1 && (
        <div className="mx-auto mt-9 flex w-fit items-start space-x-10">
          <button
            className="flex items-center justify-center rounded-full px-2 py-1 pl-3 transition-all hover:bg-[#0000002b] active:translate-x-[0.2rem]"
            onClick={() => {
              page > 1
                ? setPage((prevPage) => prevPage - 1)
                : console.log("error");
            }}
          >
            <span className="material-symbols-outlined text-xl">
              arrow_back_ios
            </span>
          </button>
          <div>
            <input
              type="number"
              min="1"
              max={Math.ceil(data.hits.length / amt)}
              value={type}
              onChange={(e) => {
                setType(e.target.value);
              }}
              onKeyDown={(e) => {
                e.key === "Enter"
                  ? handlePageChange()
                  : console.log("Small error occured!!");
              }}
              onBlur={handlePageChange}
              ref={inpRef}
              className="w-[20px] bg-transparent pt-1 text-lg outline-none"
            />
            <span className="pt-1 text-lg">
              /{" "}
              {data !== null
                ? Math.ceil(data.hits.length / amt)
                : console.log("Data has not came")}
            </span>
          </div>
          <button
            className="flex items-center justify-center rounded-full px-2 py-1 pl-3 transition-all hover:bg-[#0000002b] active:translate-x-[0.2rem]"
            onClick={() => {
              page < Math.ceil(data.hits.length / amt)
                ? setPage((prevPage) => prevPage + 1)
                : console.log("error");
            }}
          >
            <span
              className="material-symbols-outlined text-xl"
              onClick={() => {
                console.log("Clicked on span");
              }}
            >
              arrow_forward_ios
            </span>
          </button>
        </div>
      )}
      {/* Footer  */}
      <div className="flex w-full items-center justify-center space-x-2 bg-[#1f1c1c] py-3 text-sm">
        <span>
          &copy; 2024 PicSeek. All rights reserved. Designed and created by
        </span>
        <span className="font-bold">&#10024; Arbab Zafar &#10024; </span>
        <img src={developer} alt="developer" className="w-6 rounded-full" />
        <div className="px-3 space-x-4 flex items-center">
        <i className="fa-brands fa-instagram cursor-pointer text-[1.35rem] transition-all hover:text-gray-400" onClick={()=> window.open("https://www.instagram.com/arbab.fr/", '_blank')}></i>
        <i className="fa-brands fa-github cursor-pointer text-[1.35rem] transition-all hover:text-gray-400" onClick={()=> window.open("https://github.com/Arbab-Zafar", '_blank')}></i>
        </div>
      </div>
      {showModal && <Modal {...modalData} />}
    </div>
  );
}

export default App;
