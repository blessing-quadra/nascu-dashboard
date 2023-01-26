import React, { useEffect, useState } from "react";
import { GatewayCard } from "../../Components/Card/GatewayCard";
import toast, { Toaster } from "react-hot-toast";
import { GenerateAuthToken } from "../../Services/Auth/Login";
import { Navigate as Redirect, useNavigate } from "react-router-dom";
import { SVGS } from "../../Assets";

function Gateway() {
  const [allRoles, setAllRoles] = useState([]);
  const [tokenExist, setTokenExist] = useState(false);
  const [selectedScope, setSelectedScope] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let roles;
    let authData = window.sessionStorage.getItem("authData");
    const token = window.sessionStorage.getItem("token");
    let _selectedScope = window.sessionStorage.getItem("selectedScope");
    if (token) {
      // If user has loggedin and this page is manually refreshed - Token will exist in the sessionstorage
      if (authData) {
        roles = JSON.parse(authData).scopes;
        setAllRoles(roles);
        if (roles?.length === 1) {
          _selectedScope = roles[0];
          setSelectedScope(_selectedScope);
        } else if (_selectedScope) {
          _selectedScope = JSON.parse(_selectedScope);
          setSelectedScope(_selectedScope);
        }
        //   access dashboard when token exist in the session.
        if (token) {
          setTokenExist(true);
        }
      }
    } else {
      // If user is loggedin and this page is not manually refreshed - Token will not exist in the sessionstorage but userData will exist.
      if (authData) {
        roles = JSON.parse(authData).scopes;
        setAllRoles(roles);
        window.sessionStorage.getItem("rolesLength", roles?.length);
        if (roles?.length === 1) {
          _selectedScope = roles[0];
          setSelectedScope(_selectedScope);
          SelectRole(roles[0].id);
        } else if (_selectedScope) {
          _selectedScope = JSON.parse(_selectedScope);
          setSelectedScope(_selectedScope);
        }
        //   access dashboard when token exist in the session.
        if (token) {
          setTokenExist(true);
        }
      }
    }
  }, []);

  const SelectRole = (id) => {
    let authData = sessionStorage.getItem("authData");
    if (authData) {
      authData = JSON.parse(authData);

      let _selectedScope = authData.scopes.filter(
        (scope) => scope.id === id
      )[0];
      setSelectedScope(_selectedScope);
      window.sessionStorage.setItem(
        "selectedScope",
        JSON.stringify(_selectedScope)
      );

      const payload = {
        clientId: authData.clientId,
        scopeId: id,
      };
      const promise = GenerateAuthToken(payload);
      promise
        .then((response) => {
          const { responseDescription, responseBody } = response.data;
          toast.promise(promise, {
            loading: "Authenticating...",
            success: responseDescription,
            error: "Failed",
          });

          window.sessionStorage.setItem(
            "token",
            JSON.stringify(responseBody.accessToken)
          );
          window.sessionStorage.setItem(
            "refreshToken",
            JSON.stringify(responseBody.refreshToken)
          );

          window.location.reload();

          // The purpose of these actions below is to cause re-render in this component so the page can be redirected in the case of single-role users/admin
          // alert(JSON.stringify(_selectedScope))
          setTokenExist(true);
        })
        .catch((error) => {
          const { status } = error.response;
          if (status === 400) {
            toast.error("Bad request. Check and retry.");
          } else if (status === 404) {
            toast.error("Resources not available.");
          } else if (status === 500) {
            toast.error("Server error. Please retry.");
          } else {
            toast.error("Strange Error occured. Try again");
          }
        });
    }
  };

  const logoutHandler = () => {
    toast.success("Logout Successful");
    window.sessionStorage.clear();
    navigate("/login");
    // window.location.reload();
  };
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      <Toaster position="top-right" />
      {!tokenExist ? (
        <>
          <div className="flex gap-4">
            {allRoles.map(({ name, id }, index) => (
              <div className="-mt-44">
                <GatewayCard
                  onClick={() => SelectRole(id)}
                  label={name}
                  key={index}
                />
              </div>
            ))}
          </div>
          <button
            className="py-3 mt-5 px-4 bg-white flex items-center mx-auto rounded border-2 border-black font-semibold uppercase"
            onClick={logoutHandler}
          >
            <SVGS.LogoutIcon />
            Sign Out
          </button>
        </>
      ) : (
        <React.Fragment>
          {selectedScope.accessType === "CREDIT_UNION_BRANCH_OFFICER" && (
            <Redirect to={"/branch-officer/members"} />
          )}
          {selectedScope.accessType === "CREDIT_UNION_ADMINISTRATOR" && (
            <Redirect to={"/credit-union-admin/members"} />
          )}
          {selectedScope.accessType === "SUPER_ADMINISTRATOR" && (
            <Redirect to={"/super-admin"} />
          )}
        </React.Fragment>
      )}
    </div>
  );
}

export default Gateway;
