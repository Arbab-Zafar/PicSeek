import { memo } from "react";
const Footer = memo(() => {
  console.log("Footer component rendered");
  return (
    <footer>
      <div className="mt-3 flex w-full flex-wrap items-center justify-center space-x-2 bg-[#1f1c1c] py-2 text-[0.65rem] text-white sm:mt-4 sm:text-sm">
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
    </footer>
  );
});
Footer.displayName = "Footer";
// const Footer = memo(FooterComp);
export default Footer;
