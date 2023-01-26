import RightSidebar from "../../Layouts/RightSidebar/RightSidebar";
import React, { useEffect, useState } from "react";
import BranchOfficerSidebar from "../../Layouts/Sidebar/Sidebar";
import OverviewCard from "../../Components/Card/OverviewCard";
import { SVGS } from "../../Assets";
import { DataTable } from "../../Components/Table/Table";
import { Toaster } from "react-hot-toast";
import { Button } from "@mui/material";
import RegisterUserOverlay from "../../Layouts/Overlay/RegisterUserOverlay";
import { useSelector } from "react-redux";
import { ViewAllMember } from "../../Services/User/User";
import MembershipInfoOverlay from "../../Layouts/Overlay/MembershipInfoOverlay";
import { FetchAllRoles } from "../../Services/Role/Role";
import Navbar from "../../Layouts/Navbar/Navbar";
// import UserCard from "../../Components/Card/UserCard";

const styles = {
  registerBtn: {
    backgroundColor: "#0F5499",
    color: "#FFFFFF",
    padding: "12px 20px",
    fontWeight: "400",
    textTransform: "capitalize",
  },
  activateBtn: {
    backgroundColor: "#0F5499",
    color: "#FFFFFF",
    padding: "12px 20px",
    fontWeight: "400",
    fontSize: "13px",
    textTransform: "capitalize",
  },
  viewBtn: {
    border: "1px solid #0F5499",
    color: "#0F5499",
    padding: "12px 20px",
    fontWeight: "400",
    fontSize: "13px",
    textTransform: "capitalize",
  },
};
function Member() {
  const user = useSelector((state) => state.userReducer);
  const [showOverlay, setShowOverlay] = useState(false);
  const [organizationData, setOrganizationData] = useState(null);
  const [rolesData, setRolesData] = useState(null);
  const [membersData, setMembersData] = useState([]);
  const [viewUserInfo, setViewUserInfo] = useState(false);
  const [userInfoSelected, setUserInfoSelected] = useState([]);
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    // username: "",
    // emailAddress: "",
    mobileNumber: "",
    gender: "",
    maritalStatus: "",
    organizationId: JSON.parse(sessionStorage.getItem("selectedScope"))
      .organizationId,
    organizationMemberId: "",
    employeeId: "",
    password: "",
  });

  const [isLeftSidebarVisible, setIsLeftSidebarVisible] = useState(false);
  const [isRightSidebarVisible, setIsRightSidebarVisible] = useState(false);

  const overviewCardLists = [
    {
      text: "Total members",
      value: membersData.length,
      icon: <SVGS.MembershipIcon />,
    },
    {
      text: "Total registered members",
      value: membersData.filter(
        (member) => member.accountHolderStatus === "REGISTERED"
      ).length,
      icon: <SVGS.MembershipIcon />,
    },
    {
      text: "Total blocked members",
      value: membersData.filter(
        (member) => member.accountHolderStatus === "BLOCKED"
      ).length,
      icon: <SVGS.MembershipIcon />,
    },
    {
      text: "Total closed members",
      value: membersData.filter(
        (member) => member.accountHolderStatus === "CLOSED"
      ).length,
      icon: <SVGS.MembershipIcon />,
    },
    // { text: "Deposit", value: "$59,420", icon: <SVGS.DepositIcon /> },
    // { text: "Cashout", value: "$ 52,394", icon: <SVGS.CashoutIcon /> },
    // { text: "Membership", value: "6520", icon: <SVGS.MembershipIcon /> },
  ];

  useEffect(() => {
    const organizationId = JSON.parse(
      sessionStorage.getItem("selectedScope")
    ).organizationId;

    const promise = FetchAllRoles();
    const promise2 = ViewAllMember(organizationId);

    if (window.innerWidth > 540) {
      setIsLeftSidebarVisible(true);
      setIsRightSidebarVisible(true)
    } else if (window.innerWidth > 540) {
      setIsLeftSidebarVisible(false);
      setIsRightSidebarVisible(false)
    }
    // promise.then((response) => {
    //   const { contents } = response.data.responseBody;
    //   let orgsIDS = [];
    //   contents.forEach((content) => {
    //     orgsIDS.push({
    //       label: content.name,
    //       value: content.id,
    //     });
    //   });
    //   setOrganisationIDS(orgsIDS);
    // });
    const orgData = {
      label: JSON.parse(sessionStorage.getItem("selectedScope"))
        .organizationName,
      value: JSON.parse(sessionStorage.getItem("selectedScope")).organizationId,
    };
    setOrganizationData(orgData);

    promise.then((response) => {
      const { contents } = response.data.responseBody;
      const roles = [];
      contents.forEach(({ id, name }) => {
        roles.push({
          label: name,
          value: id,
        });
      });
      setRolesData(roles);
      // setMembersData(contents);
    });

    promise2.then((response) => {
      const { contents } = response.data.responseBody;
      // alert(JSON.stringify(contents))
      setMembersData(contents);
    });
  }, []);

  const rows = membersData;

  const columns = [
    {
      field: "fullName",
      headerName: "Full name",
      width: 200,
      renderCell: (props) => {
        return (
          <p>
            {props.row.firstName} {props.row.lastName}
          </p>
        );
      },
    },
    // {
    //   field: "roleId",
    //   headerName: "Role ID",
    //   width: 205,
    //   renderCell: (props) => {
    //     const CopyOrgIDHandler = (id) => {
    //       window.navigator.clipboard.writeText(id);
    //       toast.success("Copied Successfully");
    //     };
    //     return (
    //       <p className="flex items-center relative">
    //         {props.value}{" "}
    //         <span
    //           onClick={() => CopyOrgIDHandler(props.value)}
    //           title="Copy Role ID"
    //           className="flex w-5 absolute bg-white cursor-pointer left-44"
    //         >
    //           <SVGS.CopyIcon />
    //         </span>
    //       </p>
    //     );
    //   },
    // },
    {
      field: "gender",
      headerName: "Gender",
      minWidth: 100,
      flex: 1,
    },
    {
      field: "maritalStatus",
      headerName: "Marital Status",
      minWidth: 130,
      flex: 1,
    },
    { field: "mobileNumber", headerName: "Mobile Number", minWidth: 150 },
    {
      field: "organizationShortName",
      headerName: "Organisation Name",
      minWidth: 150,
    },
    {
      field: "registrationDate",
      headerName: "Registration Date",
      minWidth: 220,
      flex: 1,
    },
    {
      field: "accountHolderStatus",
      headerName: "Status",
      minWidth: 170,
      renderCell: (param) => {
        return (
          <>
            {param.value === "REGISTERED" && (
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-gray-600 border border-gray-200"></span>
                <span className="text-xs text-gray-600">REGISTERED</span>
              </div>
            )}

            {param.value === "ACTIVE" && (
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-green-600 border border-gray-200"></span>
                <span className="text-xs text-green-600">ACTIVE</span>
              </div>
            )}

            {param.value === "BLOCKED" && (
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-red-600 border border-gray-200"></span>
                <span className="text-xs text-red-600">BLOCKED</span>
              </div>
            )}

            {param.value === "CLOSED" && (
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-yellow-600 border border-gray-200"></span>
                <span className="text-xs text-yellow-600">CLOSED</span>
              </div>
            )}
          </>
        );
      },
    },
    {
      field: "",
      headerName: "Actions",
      minWidth: 160,
      renderCell: (param) => {
        const viewMemberHandler = () => {
          const data = {
            fullname: `${param.row.firstName} ${param.row.lastName}`,
            mobileNumber: param.row.mobileNumber,
            status: {
              label: param.row.accountHolderStatus,
              value: param.row.accountHolderStatus,
            },
          };
          setViewUserInfo(true);
          setUserInfoSelected(data);
        };
        return param.row.accountHolderStatus === "REGISTERED" ? (
          <Button onClick={viewMemberHandler} style={styles.activateBtn}>
            Activate
          </Button>
        ) : (
          <Button onClick={viewMemberHandler} style={styles.viewBtn}>
            View More
          </Button>
        );
      },
    },
  ];
  const tableProps = {
    columns,
    rows,
    icon: "",
    emptyDataText: "No membership data is available",
  };
  return (
    <div className="flex relative">
      <Toaster position="top-center" />
      {viewUserInfo && (
        <MembershipInfoOverlay
          data={userInfoSelected}
          setData={setUserInfoSelected}
          setShowOverlay={setViewUserInfo}
        />
      )}
      {showOverlay && (
        <RegisterUserOverlay
          data={data}
          organizationData={organizationData}
          rolesData={rolesData}
          setData={setData}
          setShowOverlay={setShowOverlay}
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
          <div className="pt-16 sm:pt-5">
            <h4 className="text-2xl font-semibold">
              Good day, {user.userInfo.firstName}!
            </h4>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 mt-4 gap-4">
            {overviewCardLists.map(({ text, value, icon }, index) => (
              <OverviewCard key={index} text={text} value={value} icon={icon} />
            ))}
          </div>
          <div className="transactions py-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center my-4">
              <h4 className="text-lg font-semibold uppercase">
                {user.userInfo.organizationName} Members
              </h4>
              <Button
                onClick={() => setShowOverlay(true)}
                style={styles.registerBtn}
              >
                Register Officer/Member
              </Button>
            </div>
            <div className="overflow-y-scroll_ h-[350px]">
              <DataTable tableProps={tableProps} />
            </div>
            {/* {membershipList.map(({ name, role }, index) => (
              <UserCard name={name} role={role} key={index} />
            ))} */}
          </div>
        </div>
        <RightSidebar isRightSidebarVisible={isRightSidebarVisible}/>
      </div>
    </div>
  );
}

export default Member;
