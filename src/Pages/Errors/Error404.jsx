

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { IMAGES, SVGS } from "../../Assets";
import Metatag from "../../Layouts/Metatag/Metatag";

function Error404() {
  const navigate = useNavigate();
  return (
    <Metatag title={"Login"}>
      <div className="w-full h-screen flex flex-col md:flex-row">
        <div className="pb-10 md:w-[400px] lg:w-[500px] h-full shadow bg-primary-theme">
          <nav className="w-full flex justify-center items-start md:p-10">
            <img src={IMAGES.Logo} className="w-24 mt-14" alt="" />
          </nav>
          <h3 className="text-xl md:text-3xl text-center px-10 text-white mt-10 font-light hidden md:flex flex-col">
            <span>Welcome to</span>
            <span className="md:mt-5 w-1/2 md:w-full mx-auto ...">
              National Association of Cooperative Credit Unions of The Gambia.
            </span>
          </h3>
        </div>
        <div className="md:w-[calc(100%_-_400px)] lg:w-[calc(100%_-_500px)] shadow">
          <div className="section-tab px-8 sm:px-20 py-5">
            <div className="md:4/5 lg:w-3/5 h-16 flex flex-wrap gap-4 items-center justify-between ..."></div>
          </div>

          <div className="px-8 sm:px-20">
            <h4 className="text-2xl">Page not found.</h4>
            <p className="text-gray-500 text-sm">
              This page you are trying to access does not exist.
            </p>
            <div className="py-4 flex gap-3">
                <p className="cursor-pointer" onClick={() => navigate(-1)}>Go back</p>
                <Link to="/login" className="cursor-pointer text-primary-theme">Goto Login</Link>
              </div>
            <div className="md:4/5 lg:w-3/5 my-4 ...">
              <SVGS.Error404Icon />
            </div>
          </div>
        </div>
      </div>
    </Metatag>
  );
}

export default Error404;
