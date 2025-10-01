import React from "react";

const Spinner = ({
  w = "w-12",
  h = "h-12",
  br = "border-4",
  color = "border-[#47A1BE]",
}) => {
  return (
    <div>
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-12 flex justify-center">
        <div className="flex flex-col items-center">
          <div
            className={`${w} ${h} ${br} ${color} border-t-transparent rounded-full animate-spin`}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Spinner;
