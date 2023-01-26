import React from "react";
import { TextInput } from "../../Components/Input/Input";
import SelectInput from "../../Components/Select/Select";

function TransactionFilterOverlay(props) {
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
      <div className="w-[420px] bg-white mx-auto rounded-lg flex flex-col items-center py-5 mt-5">
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
          <TextInput
            label="Member's ID"
            type="text"
            defaultValue={payload?.message}
            name="toDate"
            onChange={changeFilterProps}
            className="w-full"
          />
          <SelectInput
            label="Transaction Type"
            name="transactionType"
            value={payload?.type}
            onChange={changeFilterProps}
            options={[
              { label: "ALL TRANSACTIONS", vallue: "" },
              { label: "ADJUSTMENT", vallue: "ADJUSTMENT" },
              { label: "DEPOSIT", vallue: "DEPOSIT" },
              { label: "TRANSFER", vallue: "TRANSFER" },
              { label: "FEE", vallue: "FEE" },
              { label: "CASH_OUT", vallue: "CASH_OUT" },
              { label: "PAYMENT", vallue: "PAYMENT" },
              { label: "BANK_TRANSFER", vallue: "BANK_TRANSFER" },
              { label: "SETTLEMENT", vallue: "SETTLEMENT" },
              { label: "FLOAT_TRANSFER", vallue: "FLOAT_TRANSFER" },
              { label: "SALARY", vallue: "SALARY" },
              { label: "COMMISSION_PAYMENT", vallue: "COMMISSION_PAYMENT" },
            ]}
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
      </div>
    </div>
  );
}

export default TransactionFilterOverlay;
