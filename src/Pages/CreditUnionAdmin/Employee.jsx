import RightSidebar from "../../Layouts/RightSidebar/RightSidebar";
import React, { useState, useEffect } from "react";
import BranchOfficerSidebar from "../../Layouts/Sidebar/Sidebar";
import OverviewCard from "../../Components/Card/OverviewCard";
import { SVGS } from "../../Assets";
import { DataTable } from "../../Components/Table/Table";
import toast, { Toaster } from "react-hot-toast";
import { Button } from "@mui/material";
import CompleteCashoutOverlay from "../../Layouts/Overlay/CompleteCashoutOverlay";
import EmployeeOverlay from "../../Layouts/Overlay/EmployeeOverlay";
import {
  CashoutService,
  CompleteCashoutService,
} from "../../Services/Cashout/CashoutService";
import { FetchTransactions } from "../../Services/Transactions/TransactionService";
import { RefreshToken } from "../../Services/Auth/Refresh";
import Formatter from "../../Utils/Formatter";
import DeleteConfirmOverlay from "../../Layouts/Overlay/DeleteConfirmOverlay";
import ConfirmOverlay from "../../Layouts/Overlay/ConfirmOverlay";
import SelectInput from "../../Components/Select/Select";
import { FetchCashouts } from "../../Services/Deposit/DepositService";
import Navbar from "../../Layouts/Navbar/Navbar";
import {
  PaySalary,
  AddEmployeeToSchedule,
  RemoveEmployeeFromSchedule,
  FetchEachWageScheduleDetails,
} from "../../Services/Salary/Salary";
import { Link, useParams } from "react-router-dom";

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
function Employee() {
  const { id } = useParams();
  const [showOverlay, setShowOverlay] = useState(0);
  const [employeeIdToRemove, setEmployeeIdToRemove] = useState(null);
  const [scheduleDetails, setScheduleDetails] = useState(null);
  const [stats, setStats] = useState({
    transaction: 0,
    deposit: 0,
  });
  const [depositInfo, setDepositInfo] = useState(0);

  const [isLeftSidebarVisible, setIsLeftSidebarVisible] = useState(false);
  const [isRightSidebarVisible, setIsRightSidebarVisible] = useState(false);

  const [data, setData] = useState({
    wageScheduleId: id,
    employeeNumber: "",
    amount: 0,
  });

  const [massUpload, setMassUpload] = useState({
    name: "",
    description: "",
    paymentDay: "",
    month: "01",
    year: "2022",
  });

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

    const promise = FetchEachWageScheduleDetails(id);
    promise
      .then((response) => {
        const { responseDescription, responseBody } = response.data;
        toast.promise(promise, {
          loading: "Deposit processing...",
          success: responseDescription,
          error: "Failed",
        });

        const rows = responseBody?.wages?.map(
          ({ id, amount, firstName, lastName, accountHolderRegistrationStatus, employeeNumber }) => ({
            id: id,
            amount: amount.amount,
            fullName: `${firstName} ${lastName}`,
            status: accountHolderRegistrationStatus,
            employeeNumber: employeeNumber,
          })
        );
        setScheduleDetails(responseBody);
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

  const addEmployeeHandler = () => {
    if (data.employeeNumber && data.amount) {
      if (data.amount > 0) {
        const promise = AddEmployeeToSchedule(data);
        toast.promise(promise, {
          loading: "Schedule creation processing...",
          success: "Schedule created successfully",
          error: "Schedule creation failed",
        });
        promise
          .then((response) => {
            const { responseDescription, responseBody } = response.data;
            // setShowOverlay2(false);
            setTimeout(() => {
              // setDepositInfo({
              //   reference: responseBody?.reference,
              //   transactionId: responseBody?.transactionId,
              //   message: responseDescription,
              // });
              // setShowOverlay(2);
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
      } else {
        toast.error("Amount cannot be 0");
      }
    } else {
      toast.error("All fields are required!");
    }
  };

  const removeEmployeeHandler = () => {
    if (employeeIdToRemove) {
      const promise = RemoveEmployeeFromSchedule(employeeIdToRemove);
      toast.promise(promise, {
        loading: "Removing employe from schedule",
        success: "Employee successfully removed",
        error: "Employee removal failed",
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

  const salaryPaymentHandler = () => {
    const payload = {
      month: scheduleDetails.month,
      year: scheduleDetails.year,
      organizationId: scheduleDetails.organizationId,
    };

    if (payload.month && payload.year && payload.organizationId) {
      const promise = PaySalary(payload);
      toast.promise(promise, {
        loading: "Payment processing...",
        success: "Payment processed successfully",
        error: "Payment processing failed",
      });
      promise
        .then((response) => {
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
      toast.error("Something went wrong. Please try again");
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
      field: "fullName",
      headerName: "Employee Name",
      minWidth: 180,
      flex: 1,
    },
    {
      field: "employeeNumber",
      headerName: "Employee Number",
      minWidth: 180,
      flex: 1,
    },{
      field: "status",
      headerName: "Registration Status",
      minWidth: 180,
      flex: 1,
      renderCell: (param) => {
        return param.value ? <p>Not Registered</p> : <p>Registered</p>;
      },
    },
    {
      field: "action",
      headerName: "Remove Employee",
      minWidth: 180,
      flex: 1,
      renderCell: (param) => {
        const showDeleteConfirmOverlay = () => {
          setShowOverlay(3);
          setEmployeeIdToRemove(param.row.id);
        };
        return (
          <button
            onClick={showDeleteConfirmOverlay}
            className="bg-red-700 text-white py-3 px-5 rounded"
          >
            Delete
          </button>
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
        <EmployeeOverlay
          data={data}
          setData={setData}
          setShowOverlay={setShowOverlay}
          addEmployeeHandler={addEmployeeHandler}
        />
      )}
      {showOverlay === 2 && (
        <ConfirmOverlay
          setShowOverlay={setShowOverlay}
          salaryPaymentHandler={salaryPaymentHandler}
        />
      )}
      {showOverlay === 3 && (
        <DeleteConfirmOverlay
          setShowOverlay={setShowOverlay}
          Handler={removeEmployeeHandler}
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
            <h4 className="text-2xl font-semibold flex gap-2">
              <Link to="/credit-union-admin/salary" className="px-4 text-xs rounded-lg py-2 bg-[#000000] text-white flex items-center justify-center">
                back
              </Link>
              Schedule Details
            </h4>
          </div>
          <div className="mt-10 grid grid-cols-3 gap-4">
            <h4 className="text-sm flex flex-col text-gray-400">
              SCHEDULE ID:{" "}
              <span className="text-md text-black">{scheduleDetails?.id}</span>
            </h4>
            <h4 className="text-sm flex flex-col text-gray-400">
              PAYDAY:{" "}
              <span className="text-md text-black">
                {scheduleDetails?.payDay}
              </span>
            </h4>
            <h4 className="text-sm flex flex-col text-gray-400">
              MONTH:{" "}
              <span className="text-md text-black">
                {scheduleDetails?.month}
              </span>
            </h4>
            <h4 className="text-sm flex flex-col text-gray-400">
              YEAR:{" "}
              <span className="text-md text-black">
                {scheduleDetails?.year}
              </span>
            </h4>
            <h4 className="text-sm flex flex-col text-gray-400">
              ORGANISATION NAME:{" "}
              <span className="text-md text-black">
                {scheduleDetails?.organizationName}
              </span>
            </h4>
          </div>
          <div className="transactions py-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center my-4">
              <h4 className="text-lg font-semibold">Employee List</h4>
              <div className="flex items-center gap-4">
                <Button
                  onClick={() => setShowOverlay(1)}
                  style={styles.registerBtn2}
                >
                  Add Employee
                </Button>
                <Button
                  onClick={() => setShowOverlay(2)}
                  style={styles.registerBtn}
                >
                  Pay Salary
                </Button>
              </div>
            </div>

            <div className="overflow-y-scroll_ h-[350px]">
              {/* {JSON.stringify(tableProps)} */}
              <DataTable tableProps={tableProps} />
            </div>

            {/* {membershipList.map(({ name, role }, index) => (
              <UserCard name={name} role={role} key={index} />
            ))} */}
          </div>
        </div>
        <RightSidebar isRightSidebarVisible={isRightSidebarVisible} />
      </div>
    </div>
  );
}

export default Employee;
