


import React, { useEffect, useState } from "react";
import BranchOfficerSidebar from "../../Layouts/Sidebar/Sidebar";
import OverviewCard from "../../Components/Card/OverviewCard";
import { SVGS } from "../../Assets";
import { DataTable } from "../../Components/Table/Table";
import { Toaster } from "react-hot-toast";
import { Button } from "@mui/material";
import CreateOrganisation from "../../Layouts/Overlay/CreateOrganisation";
import MembershipInfoOverlay from "../../Layouts/Overlay/MembershipInfoOverlay";
import Navbar from "../../Layouts/Navbar/Navbar";
import { FetchAllOrganizations } from "../../Services/Organization/Organization";
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
function Organisation() {
  const [showOverlay, setShowOverlay] = useState(false);
  const [showUpdateOverlay, setShowUpdateOverlay] = useState(false);
  const [organizationData, setOrganizationData] = useState(null);
  const [rolesData, setRolesData] = useState(null);
  const [membersData, setMembersData] = useState([]);
  const [viewUserInfo, setViewUserInfo] = useState(false);
  const [userInfoSelected, setUserInfoSelected] = useState([]);
  const [data, setData] = useState({
    name: "Quadra Platform LLC",
    description: "Quadra Platform LLC",
    countryCode: "GMB",
    username: "quadraplatform",
    password: "ABc123456!",
    emailAddress: "info@quadraplatform.com",
    administratorRoleName: "Platform Administrator Role Level 1",
    organizationType: "PLATFORM",
    address: "Gambia",
    externalId: "28",
    shortName: "quadraplatform",
    currencyCode: "GMD",
  });

  const [isLeftSidebarVisible, setIsLeftSidebarVisible] = useState(false);
  const [isRightSidebarVisible, setIsRightSidebarVisible] = useState(false);

  const overviewCardLists = [
    {
      text: "Total Branch officers",
      value: membersData.length,
      icon: <SVGS.MembershipIcon />,
    },
    {
      text: "Total Credit Union Admin",
      value: membersData.filter(
        (member) => member.accountHolderStatus === "REGISTERED"
      ).length,
      icon: <SVGS.MembershipIcon />,
    },
    {
      text: "Total Super Admin",
      value: membersData.filter(
        (member) => member.accountHolderStatus === "BLOCKED"
      ).length,
      icon: <SVGS.MembershipIcon />,
    },
  ];

  useEffect(() => {
    if (data?.organizationType === "CREDIT_UNION") {
      let _data = {
        ...data,
        registrationRoleName: "Credit Union Member Level 1",
        parentOrganizationShortName: "NASCU",
        platformOrganizationShortName: "quadra",
      };
      setData(_data);
    } else if (data?.organizationType === "PARTNER") {
      let _data = data;
      _data.parentOrganizationShortName = "naccug";
      _data.platformOrganizationShortName = "quadra";
      delete data.registrationRoleName;
      setData(_data);
    } else if (data?.organizationType === "PLATFORM") {
      let _data = data;
      delete _data.registrationRoleName;
      delete _data.parentOrganizationShortName;
      delete _data.platformOrganizationShortName;
      setData(_data);
    }
  }, [data, data?.organizationType]);

  useEffect(() => {
    const organizationId = JSON.parse(
      sessionStorage.getItem("selectedScope")
    ).organizationId;

    const promise = FetchAllOrganizations(organizationId);

    if (window.innerWidth > 540) {
      setIsLeftSidebarVisible(true);
      setIsRightSidebarVisible(true);
    } else if (window.innerWidth > 540) {
      setIsLeftSidebarVisible(false);
      setIsRightSidebarVisible(false);
    }
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
      setMembersData(contents);
    });
  }, []);

  const rows = membersData;

  const columns = [
    {
      field: "id",
      headerName: "Organization ID",
      minWidth: 130,
      flex: 1,
    },
    {
      field: "name",
      headerName: "Organization Name",
      width: 200,
      flex: 1
    },
    {
      field: "parentOrganizationType",
      headerName: "Organization Type",
      minWidth: 180,
    },
    { field: "shortName", headerName: "Short Name", minWidth: 150 },
    { field: "action", headerName: "Action", minWidth: 180, renderCell: (props)=>{
      
      setShowUpdateOverlay(true)
      return(
        <button className="px-3 py-2 rounded bg-primary-theme text-white text-sm">Update Information</button>
      )
    } 
  },
  ];
  const tableProps = {
    columns,
    rows,
    icon: "",
    emptyDataText: "No Organisation is available",
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
        <CreateOrganisation
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
        <div className="middle-content w-full sm:w-[calc(100%)] p-6">
          <div className="pt-16 sm:pt-5">
            <h4 className="text-2xl font-semibold">
              Good day, Super Administrator!
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
                All available Organisations
              </h4>
              <Button
                onClick={() => setShowOverlay(true)}
                style={styles.registerBtn}
              >
                Create new Organisation
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
      </div>
    </div>
  );
}

export default Organisation;
