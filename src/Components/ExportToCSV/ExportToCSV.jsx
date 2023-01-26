import React from "react";
import { CSVLink } from "react-csv";
import SelectInput from "../Select/Select";

function ExportToCSV({ csvData, children }) {
  return (
    <div className="w-full">
      <div className="justify-end flex items-center pb-5 gap-4">
        {csvData.length > 0 && (
          <>
            <button className="bg-primary-theme text-white py-3 px-4 rounded">
              <CSVLink data={csvData}>Export Report as CSV</CSVLink>
            </button>
          </>
        )}
      </div>
      {children}
    </div>
  );
}

export default ExportToCSV;
