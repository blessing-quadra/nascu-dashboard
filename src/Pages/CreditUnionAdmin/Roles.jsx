import RightSidebar from "../../Layouts/RightSidebar/RightSidebar";
import React, { useEffect, useState } from "react";
import BranchOfficerSidebar from "../../Layouts/Sidebar/Sidebar";
import toast, { Toaster } from "react-hot-toast";
import { Alert, Button } from "@mui/material";
// import FundAdminWalletOverlay from "../../Layouts/Overlay/FundAdminWalletOverlay";
// import { DataTable } from "../../Components/Table/Table";
import CheckboxContainer from "../../Components/Checkbox/CheckboxContainer";
import Navbar from "../../Layouts/Navbar/Navbar";
// import { TextInput } from "../../Components/Input/Input";
// import { Link } from "react-router-dom";
import { FetchOrganisationRoles, updateRolePermission } from "../../Services/Role/Role";
import CreateRoleOverlay from "../../Layouts/Overlay/CreateRoleOverlay";
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
function Roles() {
  const [showOverlay, setShowOverlay] = useState(false);
  // const [wallet, setWallet] = useState(null);
  const [isUserSelected, setIsUserSelected] = useState(false);

  const [isLeftSidebarVisible, setIsLeftSidebarVisible] = useState(false);
  const [isRightSidebarVisible, setIsRightSidebarVisible] = useState(false);

  const [rolesData, setRolesData] = useState(null);
  const [selectedRoleIndex, setSelectedRoleIndex] = useState(null);
  const [selectedPermissionsList, setSelectedPermissionsList] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  const [data, setData] = useState({
    name: "",
    accessType: "CREDIT_UNION_MEMBER",
    description: "Description about the role",
    organizationId: JSON.parse(sessionStorage.getItem("selectedScope"))?.organizationId
  });

  useEffect(() => {
    if (window.innerWidth > 540) {
      setIsLeftSidebarVisible(true);
      setIsRightSidebarVisible(true);
    } else if (window.innerWidth > 540) {
      setIsLeftSidebarVisible(false);
      setIsRightSidebarVisible(false);
    }

    const organizationId = JSON.parse(sessionStorage.getItem("selectedScope"))?.organizationId;
    const fetchRolesPromise = FetchOrganisationRoles(organizationId);
    fetchRolesPromise.then((response) => {
      const { contents } = response.data.responseBody;
      setRolesData(contents);
    });
  }, []);

  const viewPermissionsOfRole = (index, id) => {
    setSelectedRoleIndex(index);
    setSelectedId(id)
    setIsUserSelected(true);
  };

  const savePermissionsHandler = () => {
    let truePermissions = [];
    selectedPermissionsList.forEach(permission=>{
      if(permission.status){
        truePermissions.push({
          name: permission.name
        })
      }
    });
    const payload = {
      data: truePermissions,
      selectedId: selectedId
    }
    const promise = updateRolePermission(payload);
    promise
      .then((response) => {
        const { responseDescription } = response.data;
        toast.promise(promise, {
          loading: "Permission updating...",
          success: responseDescription,
          error: "Update failed",
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
        } else {
          toast.error(responseBody.errorDescription);
        }
      });
  }

  return (
    <div className="flex relative">
      <Toaster position="top-center" />
      {showOverlay && (
        <CreateRoleOverlay
          // wallet={wallet}
          data={data}
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
          <div className="pt-16 sm:pt-5 flex items-center gap-4">
            <h4 className="text-2xl font-semibold">Roles Management</h4>
          </div>

          <div className="transactions py-4">
            <div className="flex flex-col my-4">
              <Alert severity="info">
                This section shows the lists of roles and the management
              </Alert>
              <div className="flex mt-4 items-center gap-4">
                <Button
                  style={styles.registerBtn}
                  onClick={() => setShowOverlay(true)}
                >
                  Create new role
                </Button>
              </div>

              {isUserSelected ? (
                <div className="pt-5">
                  <h4 className="text-xl font-semibold mb-3">
                    Permissions List
                  </h4>
                  <Button
                    style={{
                      backgroundColor: "#000000",
                      fontSize: "12px",
                      color: "#ffffff",
                    }}
                    onClick={() => setIsUserSelected(false)}
                  >
                    Go Back
                  </Button>

                  <p className="text-sm text-gray-500 my-3">
                    <span className="text-black font-bold">Description:</span>{" "}
                    {rolesData[selectedRoleIndex].description}
                  </p>
                  <div className="w-full h-[320px] overflow-y-scroll">
                    <CheckboxContainer
                      selectedPermissionsList={selectedPermissionsList}
                      setSelectedPermissionsList={setSelectedPermissionsList}
                      permissions={rolesData}
                      selectedRoleIndex={selectedRoleIndex}
                    />
                  </div>
                  <div className="flex justify-start items-center mt-4">
                    <button onClick={savePermissionsHandler} className="bg-primary-theme py-2 px-4 rounded text-white">
                      Save permissions
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-4">
                  <h4 className="text-xl font-semibold mb-6">Roles List</h4>
                  <div className="h-[390px] pr-5 overflow-y-scroll">
                    {rolesData?.map(({ name, id }, index) => (
                      <div className="h-auto my-3 sm:my-0 sm:h-12 hover:bg-blue-50 rounded flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-0 sm:items-center">
                        {name}{" "}
                        <span
                          className="text-sm text-primary-theme cursor-pointer border border-primary-theme py-2 px-3 rounded"
                          onClick={() => viewPermissionsOfRole(index, id)}
                        >
                          View permissions
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <RightSidebar
          isRightSidebarVisible={isRightSidebarVisible}
        />
      </div>
    </div>
  );
}

export default Roles;
