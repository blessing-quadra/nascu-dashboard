import React from "react";
import toast from "react-hot-toast";
import { SVGS } from "../../Assets";

function ReportCard(props) {
  const {
    isActive,
    name,
    value,
    isDetailsAvailable,
    viewMoreHandler,
    ...restProps
  } = props;

  const cannotOpenHandle = () => {
    toast("This card cannot be opened");
  }
  return (
    <div className="h-28">
      <div onClick={() => isDetailsAvailable ? viewMoreHandler(name) : cannotOpenHandle()} className="w-full h-20 relative  bg-[#1358e4] rounded-2xl group">
        <div className="transition-all duration-700 absolute p-4 rounded-2xl bg-primary-theme left-0 top-0 w-full h-20 group-hover:top-2">
          <div
            className={`${
              isActive ? "border border-primary-theme" : "border-gray-200"
            } transition-all duration-700 absolute px-4 py-3 rounded-xl bg-white border  left-0 top-0 w-full h-28 group-hover:top-2 flex flex-col justify-between`}
          >
            <h5 className="text-xs capitalize">{name}</h5>
            <h3 className="text-4xl">{value}</h3>
            {/* {isDetailsAvailable && (
              <button
                onClick={() => viewMoreHandler(name)}
                title="view more details"
                className="transition-all duration-700 group-hover:opacity-100 hover:bg-white hover:shadow rounded-full w-7 h-7 bg-black absolute right-2 top-8 flex opacity-0 items-center justify-center"
              >
                <SVGS.EyeIcon size={20} />
              </button>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportCard;
