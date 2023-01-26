import RightSidebar from "../../Layouts/RightSidebar/RightSidebar";
import React, { useState, useEffect } from "react";
import BranchOfficerSidebar from "../../Layouts/Sidebar/Sidebar";
import OverviewCard from "../../Components/Card/OverviewCard";
import { SVGS } from "../../Assets";
import { DataTable } from "../../Components/Table/Table";
import toast, { Toaster } from "react-hot-toast";
import { Button } from "@mui/material";
import CompleteCashoutOverlay from "../../Layouts/Overlay/CompleteCashoutOverlay";
import SalaryOverlay from "../../Layouts/Overlay/SalaryOverlay";
import {
  CashoutService,
  CompleteCashoutService,
} from "../../Services/Cashout/CashoutService";
import { FetchTransactions } from "../../Services/Transactions/TransactionService";
import { RefreshToken } from "../../Services/Auth/Refresh";
import Formatter from "../../Utils/Formatter";
import BulkySalaryScheduleOverlay from "../../Layouts/Overlay/BulkySalaryScheduleOverlay";
import SelectInput from "../../Components/Select/Select";
import { FetchCashouts } from "../../Services/Deposit/DepositService";
import Navbar from "../../Layouts/Navbar/Navbar";
import {
  CreateWageSchedule,
  FetchWagesSchedule,
  RemoveSalarySchedule,
  UploadSalaryFile,
} from "../../Services/Salary/Salary";
import { Link } from "react-router-dom";
import DeleteConfirmOverlay from "../../Layouts/Overlay/DeleteConfirmOverlay";
// import UserCard from "../../Components/Card/UserCard";

const styles = {
  registerBtn: {
    backgroundColor: "#0F5499",
    color: "#FFFFFF",
    padding: "12px 20px",
    fontWeight: "400",
    textTransform: "capitalize",
  },
  registerBtn2: {
    backgroundColor: "#000000",
    color: "#FFFFFF",
    padding: "12px 20px",
    fontWeight: "400",
    textTransform: "capitalize",
  },
};
function Salary() {
  const [showOverlay, setShowOverlay] = useState(0);
  const [showOverlay2, setShowOverlay2] = useState(false);
  const [scheduleIdToRemove, setScheduleIdToRemove] = useState(null);
  const [salaryFileUploaded, setSalaryFileUploaded] = useState(null);
  const [stats, setStats] = useState({
    transaction: 0,
    deposit: 0,
  });
  const [bulkyPayload, setBulkyPayload] = useState({
    name: "Schedule demo name",
    description: "This is a test description",
    paymentDate: "2022-10-22",
  });

  const [data, setData] = useState({
    date: "2022-01",
    description: "Description about the wages schedule",
    recurringDayOfMonth: 25,
  });
  const [data2, setData2] = useState({
    reference: "12953709",
    cashOutStatus: "REDEEMED",
  });

  const [isLeftSidebarVisible, setIsLeftSidebarVisible] = useState(false);
  const [isRightSidebarVisible, setIsRightSidebarVisible] = useState(false);

  const [rowData, setRowData] = useState([]);

  useEffect(() => {
    if (window.innerWidth > 540) {
      setIsLeftSidebarVisible(true);
      setIsRightSidebarVisible(true);
    } else if (window.innerWidth > 540) {
      setIsLeftSidebarVisible(false);
      setIsRightSidebarVisible(false);
    }

    const mobileNum = JSON.parse(sessionStorage.getItem("mobileNumber"));
    const payload = {
      receiverIdentity: {
        identity: mobileNum,
        identityType: "MSISDN",
      },
      sendingIdentity: {
        identity: mobileNum,
        identityType: "MSISDN",
      },
      page: "1",
      size: "50",
    };

    const promise = FetchWagesSchedule();
    promise
      .then((response) => {
        const { responseDescription, responseBody } = response.data;
        toast.promise(promise, {
          loading: "Deposit processing...",
          success: responseDescription,
          error: "Failed",
        });

        const rows = responseBody?.contents
          ?.reverse()
          ?.map(
            ({
              id,
              totalAmount,
              payDay,
              month,
              year,
              containsUnregisteredAccountHolders,
              paidStatus,
            }) => ({
              id: id,
              amount: totalAmount,
              payDay: payDay,
              month: month,
              year: year,
              hasUnregistered: containsUnregisteredAccountHolders,
              paidStatus: paidStatus,
            })
          );

        let _totalSchedule = 0;
        let _paidScheduleCount = 0;
        rows.forEach((elem) => {
          if (elem.paidStatus === false) {
            _paidScheduleCount = _paidScheduleCount + 1;
          }
          _totalSchedule = _totalSchedule + 1;
        });
        setStats({
          totalSchedule: _totalSchedule,
          paidScheduleCount: _paidScheduleCount,
        });
        setRowData(rows);
      })
      .catch((error) => {
        const { status, responseBody } = error?.response?.data;

        if (status === 400) {
          toast.error("Bad request. Check and retry.");
        } else if (status === 404) {
          toast.error("Resources not available.");
        } else if (status === 500) {
          toast.error(responseBody.errorDescription);
        } else if (status === "EXPIRED_ACCESS") {
          toast.error(responseBody.errorDescription);
          RefreshToken();
        } else {
          toast.error(responseBody.errorDescription);
        }
      });
  }, []);

  const overviewCardLists = [
    {
      text: "Total active salary schedule",
      value: stats.totalSchedule,
      icon: <SVGS.TransactionIcon />,
    },
    {
      text: "Total inactive salary schedule",
      value: stats.paidScheduleCount,
      icon: <SVGS.CashoutIcon />,
    },
    // { text: "Cashout", value: "$ 52,394", icon: <SVGS.CashoutIcon /> },
    // { text: "Membership", value: "6520", icon: <SVGS.MembershipIcon /> },
  ];

  const createBulkSchedule = () => {
    const { name, description } = bulkyPayload;
    const paymentDate = bulkyPayload.paymentDate.split("-");
    const year = paymentDate[0];
    const month = paymentDate[1];
    const paymentDay = paymentDate[2];

    const formData = new FormData();
    const file = salaryFileUploaded;
    formData.append("file", file);

    const data = {
      name,
      description,
      month,
      year,
      paymentDay,
      payload: formData,
    };
    const promise = UploadSalaryFile(data);
    toast.promise(promise, {
      loading: "Bulk salary processing...",
      success: "Bulk salary created successfully",
      error: "Bulk salary Failed",
    });
    promise
      .then((response) => {
        const { responseDescription, responseBody } = response.data;
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      })
      .catch((error) => {
        const { status, responseBody } = error?.response?.data;

        if (status === 400) {
          toast.error("Bad request. Check and retry.");
        } else if (status === 404) {
          toast.error("Resources not available.");
        } else if (status === 500) {
          toast.error(responseBody.errorDescription);
        } else if (status === "EXPIRED_ACCESS") {
          toast.error(responseBody.errorDescription);
          RefreshToken();
        } else {
          toast.error(responseBody.errorDescription);
        }
      });
  };

  const scheduleSalary = () => {
    const dateList = data.date.split("-"); // index[0] = Year, index[1] = Month
    const month = dateList[1];
    const year = dateList[0];
    const payload = data.recurringDayOfMonth
      ? {
          month: month,
          year: year,
          organizationId: JSON.parse(sessionStorage.getItem("selectedScope"))
            .organizationId,
          description: data.description,
          recurringDayOfMonth: parseInt(data.recurringDayOfMonth),
        }
      : {
          month: month,
          year: year,
          organizationId: JSON.parse(sessionStorage.getItem("selectedScope"))
            .organizationId,
          description: data.description,
        };

    const promise = CreateWageSchedule(payload);
    promise
      .then((response) => {
        const { responseDescription, responseBody } = response.data;
        toast.promise(promise, {
          loading: "Schedule creation processing...",
          success: "Schedule created successfully",
          error: "Schedule creation failed",
        });
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      })
      .catch((error) => {
        const { status, responseBody } = error?.response?.data;

        if (status === 400) {
          toast.error("Bad request. Check and retry.");
        } else if (status === 404) {
          toast.error("Resources not available.");
        } else if (status === 500) {
          toast.error(responseBody.errorDescription);
        } else if (status === "EXPIRED_ACCESS") {
          toast.error(responseBody.errorDescription);
          RefreshToken();
        } else {
          toast.error(responseBody.errorDescription);
        }
      });

    // setTimeout(() => {
    //   setShowOverlay2(false);
    // }, 1500);
  };

  const removeScheduleHandler = () => {
    if (scheduleIdToRemove) {
      const promise = RemoveSalarySchedule(scheduleIdToRemove);
      toast.promise(promise, {
        loading: "Removing schedule from schedule",
        success: "Schedule successfully removed",
        error: "Schedule removal failed",
      });
      promise
        .then(() => {
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        })
        .catch((error) => {
          const { status, responseBody } = error?.response?.data;

          if (status === 400) {
            toast.error("Bad request. Check and retry.");
          } else if (status === 404) {
            toast.error("Resources not available.");
          } else if (status === 500) {
            toast.error(responseBody.errorDescription);
          } else {
            toast.error(responseBody.errorDescription);
          }
        });
    } else {
      toast.error("Employee ID not found");
    }
  };

  const rows = rowData;

  const columns = [
    {
      field: "id",
      headerName: "Transaction ID",
      width: 205,
      renderCell: (props) => {
        const CopyOrgIDHandler = (id) => {
          window.navigator.clipboard.writeText(id);
          toast.success("Copied Successfully");
        };
        return (
          <p className="flex items-center relative">
            {props.value}{" "}
            <span
              onClick={() => CopyOrgIDHandler(props.value)}
              title="Copy Transaction ID"
              className="flex w-5 absolute bg-white cursor-pointer left-44"
            >
              <SVGS.CopyIcon />
            </span>
          </p>
        );
      },
    },
    {
      field: "amount",
      headerName: "Amount (GMD)",
      minWidth: 180,
      flex: 1,
      renderCell: (param) => {
        return (
          <p className="text-center flex justify-center pl-4">{param.value}</p>
        );
      },
    },
    {
      field: "payDay",
      headerName: "Payment Day",
      minWidth: 180,
      flex: 1,
    },
    {
      field: "month",
      headerName: "Payment Month",
      minWidth: 180,
      flex: 1,
    },
    {
      field: "year",
      headerName: "Payment Year",
      minWidth: 180,
      flex: 1,
    },
    {
      field: "hasUnregistered",
      headerName: "Has unregistered user(s)",
      minWidth: 180,
      flex: 1,
      renderCell: (param) => {
        return param.value ? <p>True</p> : <p>False</p>;
      },
    },
    {
      field: "paidStatus",
      headerName: "Payment Status",
      minWidth: 180,
      flex: 1,
      renderCell: (param) => {
        return param.value === true ? (
          <p className="text-center flex justify-center px-4 py-2 bg-yellow-50 text-yellow-700 border border-yellow-300 text-xs rounded">
            PAID
          </p>
        ) : (
          <p className="text-center flex justify-center px-4 py-2 bg-green-50 text-green-700 border border-green-300 text-xs rounded">
            NOT PAID
          </p>
        );
      },
    },
    {
      field: "action",
      headerName: "Action",
      minWidth: 250,
      renderCell: (param) => {
        const showDeleteConfirmOverlay = () => {
          setScheduleIdToRemove(param.row.id);
          setShowOverlay(3);
        };
        return (
          <div className="flex items-center gap-2">
            <button
              onClick={showDeleteConfirmOverlay}
              className="bg-red-700 py-3 rounded px-4 text-white"
            >
              Remove
            </button>
            <Link
              to={`/credit-union-admin/salary/employee/${param.row.id}`}
              className="py-3 px-4 rounded bg-primary-theme text-white text-sm cursor-pointer"
            >
              View more
            </Link>
          </div>
        );
      },
    },
  ];

  const tableProps = {
    columns,
    rows,
    icon: "",
    emptyDataText: "No Salary data is available",
  };

  return (
    <div className="flex relative">
      <Toaster position="top-center" />
      {showOverlay === 1 && (
        <SalaryOverlay
          data={data}
          setData={setData}
          setShowOverlay={setShowOverlay}
          scheduleSalary={scheduleSalary}
        />
      )}
      {showOverlay === 2 && (
        <BulkySalaryScheduleOverlay
          bulkyPayload={bulkyPayload}
          setBulkyPayload={setBulkyPayload}
          createBulkSchedule={createBulkSchedule}
          setShowOverlay={setShowOverlay}
          salaryFileUploaded={salaryFileUploaded}
          setSalaryFileUploaded={setSalaryFileUploaded}
          // initiateCashoutHandler={initiateCashoutHandler}
        />
      )}
      {showOverlay === 3 && (
        <DeleteConfirmOverlay
          setShowOverlay={setShowOverlay}
          Handler={removeScheduleHandler}
        />
      )}
      {showOverlay2 && (
        <CompleteCashoutOverlay
          data={data2}
          setData={setData2}
          setShowOverlay={setShowOverlay2}
          completeCashoutHandler={completeCashoutHandler}
        />
      )}
      <BranchOfficerSidebar
        isLeftSidebarVisible={isLeftSidebarVisible}
        setIsLeftSidebarVisible={setIsLeftSidebarVisible}
      />
      <div className="w-full sm:w-[calc(100%_-_230px)] flex items-start h-screen bg-white">
        <Navbar
          setIsLeftSidebarVisible={setIsLeftSidebarVisible}
          setIsRightSidebarVisible={setIsRightSidebarVisible}
        />
        <div className="middle-content w-full sm:w-[calc(100%_-_240px)] p-6">
          <div className="pt-4 flex items-center gap-4">
            <h4 className="text-2xl font-semibold">Salary</h4>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 mt-4 gap-4">
            {overviewCardLists.map(({ text, value, icon }, index) => (
              <OverviewCard key={index} text={text} value={value} icon={icon} />
            ))}
          </div>
          <div className="transactions py-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center my-4">
              <h4 className="text-lg font-semibold">Wages Schedule list</h4>
              <div className="flex items-center gap-4">
                <Button
                  onClick={() => setShowOverlay(1)}
                  style={styles.registerBtn}
                >
                  Create wages schedule
                </Button>
                <Button
                  onClick={() => setShowOverlay(2)}
                  style={styles.registerBtn2}
                >
                  Create bulk schedule
                </Button>
              </div>
            </div>

            <div className="overflow-y-scroll_ h-[350px]">
              <DataTable tableProps={tableProps} />
            </div>
          </div>
        </div>
        <RightSidebar isRightSidebarVisible={isRightSidebarVisible} />
      </div>
    </div>
  );
}

export default Salary;
