import React from "react";
import { TextInput } from "../../Components/Input/Input";
import SelectInput from "../../Components/Select/Select";

function CreditUnionReportFilterOverlay(props) {
  const {
    payload,
    changeFilterProps,
    generateReport,
    filterOptions,
    setShowOverlay,
    ...restProps
  } = props;

  const hideOverlay = (e) => {
    if (e.target.classList.contains("overlay")) {
      setShowOverlay(false);
    }
  };
  return (
    <div
      onClick={hideOverlay}
      className="overlay w-full h-screen bg-[#00000090] fixed z-30"
    >
      <form onSubmit={generateReport} className="w-[420px] bg-white mx-auto rounded-lg flex flex-col items-center py-5 mt-5">
        <p className="text-yellow-800 bg-yellow-50 text-sm">
          Select date range here if you wish to filter by date range
        </p>
        <div className="flex flex-col w-full px-10">
          <TextInput
            label="From"
            type="date"
            defaultValue={payload?.fromDate}
            name="fromDate"
            onChange={changeFilterProps}
            className="w-full"
          />
          <TextInput
            label="To"
            type="date"
            defaultValue={payload?.toDate}
            name="toDate"
            onChange={changeFilterProps}
            className="w-full"
          />
          <div className="hidden">
            <SelectInput
              label="Type"
              name="type"
              value={payload?.type}
              onChange={changeFilterProps}
              options={filterOptions}
            />
          </div>
          <button
            onClick={generateReport}
            className="w-full h-12 rounded-lg bg-primary-theme text-white"
          >
            Generate Report
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreditUnionReportFilterOverlay;
