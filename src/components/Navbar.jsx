import { memo } from "react";
const Navbar = memo(() => {
  return (
    <>
      <header>
        <nav className="flex w-full items-center justify-center bg-[#1f1c1c] py-2 font-poppins text-white shadow-[0px_0px_10px_0px_#777777]">
          {/* <img src={logo} alt="" className='w-8 mr-1'/> */}

          <span className="text-xl font-semibold tracking-[0.08em] sm:text-2xl">
            &#9734;&#10024;PicSeek&#10024;&#9734;
          </span>
        </nav>
      </header>
    </>
  );
});
Navbar.displayName = "Navbar";

export default Navbar;
