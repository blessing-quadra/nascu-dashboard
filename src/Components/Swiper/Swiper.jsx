import React, { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation, Pagination } from "swiper";

// Import Swiper styles
import "swiper/swiper.min.css";
SwiperCore.use([Navigation]);

function SwiperContainer({ data }) {
  const navigationNextRef = useRef(null);
  const navigationPrevRef = useRef(null);
  //   useEffect(() => {
  //     new Swiper(".swiper", {
  //       //enable hash navigation
  //     //   hashNavigation: true,
  //     });
  //   }, []);

  return (
    <div className="w-full my-5">
      <Swiper
        className="swiper"
        modules={[Navigation, Pagination]}
        spaceBetween={50}
        slidesPerView={3}
        pagination={{ clickable: true }}
        navigation={{
          prevEl: navigationPrevRef.current,
          nextEl: navigationNextRef.current,
        }}
        onSlideChange={() => console.log("slide change")}
        onSwiper={(swiper) => console.log(swiper)}
      >
        {Object.keys(data).map((keyName, id) => (
          <SwiperSlide>
            <div
              className="w-full h-[120px] flex flex-col items-center justify-center shadow border border-gray-200 rounded"
              key={id}
            >
              <p className="text-sm text-gray-400">{keyName}</p>{" "}
              <p className="text-sm">{data[keyName]}</p>
            </div>
          </SwiperSlide>
        ))}

        {/* <div>
          <button ref={navigationNextRef}>Next</button>
          <button ref={navigationPrevRef}>Prev</button>
        </div> */}
      </Swiper>
    </div>
  );
}

export default SwiperContainer;
