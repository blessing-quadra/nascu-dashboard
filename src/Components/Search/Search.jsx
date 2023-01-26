import React from "react";
import { SVGS } from "../../Assets";
import { TextInput } from "../Input/Input";

function Search({
  filterHandler,
  filterProperties,
  selectedFilterProperties,
  setSelectedFilterProperties,
  showFilterOptionLists,
  setShowFilterOptionLists
}) {
  return (
    <div className="w-full">
      <div className="flex items-center gap-5 w-full">
        <button
          onClick={() => setShowFilterOptionLists(true)}
          className="px-5 h-14 rounded text-sm flex items-center gap-1 border border-gray-200"
        >
          <SVGS.FilterIcon />
          Filter: {selectedFilterProperties}
        </button>
        <div className="w-2/5 ...">
          <TextInput
            label="Search"
            className="w-full"
            onChange={filterHandler}
          />
        </div>
      </div>
      {showFilterOptionLists && (
        <div className="w-full relative h-14 flex gap-2 items-center px-2 border border-gray-200 mb-4">
          <span
            onClick={() => setShowFilterOptionLists(false)}
            className="absolute cursor-pointer left-0 -top-4 bg-red-600"
          >
            <SVGS.CloseIcon />{" "}
          </span>
          {filterProperties.map((filterProp) => (
            <button
              onClick={() => setSelectedFilterProperties(filterProp)}
              className={`px-3 h-10 rounded text-xs ${
                filterProp === selectedFilterProperties ? "bg-gray-200" : ""
              } flex items-center gap-1 border border-gray-200`}
            >
              {filterProp}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default Search;
