import { Avatar } from "@mui/material";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import {
  FetchInfoWithNumber,
  FetchInfoWithUsername,
} from "../../Services/User/User";
import { useSelector, useDispatch } from "react-redux";
import { actions } from "../../State/slices/userSlice";
import { RefreshToken } from "../../Services/Auth/Refresh";
import { GetWalletDetails } from "../../Services/Finances/Finances";
import { useState } from "react";
import {Formatter} from "../../Utils/Formatter";

function RightSidebar(props) {
  const [wallet, setWallet] = useState(null);
  const user = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();
  useEffect(() => {
    // Get personal information of the branch officer.
    let roles = window.sessionStorage.getItem("authData");
    if (roles) {
      const mobileNumber = window.sessionStorage.getItem("mobileNumber");
      const userName = window.sessionStorage.getItem("userName");
      const scope = JSON.parse(window.sessionStorage.getItem("selectedScope")).accessType;

      if (mobileNumber && !userName) {
        const promise = FetchInfoWithNumber(JSON.parse(mobileNumber));
        toast.promise(promise, {
          loading: "Fetching data",
          success: "fetched successfully",
          error: "Fetching failed",
        });
        promise
          .then((response) => {
            const { responseBody } = response?.data;
            dispatch(actions.updateUserInfo(responseBody));
            if (responseBody.errorCode === "EXPIRED_ACCESS") {
              toast.error(responseBody.errorDescription);
              const promise = RefreshToken();
              promise.then((resp) => {
                const { accessToken, refreshToken } = resp.data.responseBody;
                sessionStorage.setItem("token", JSON.stringify(accessToken));
                sessionStorage.setItem(
                  "refreshToken",
                  JSON.stringify(refreshToken)
                );
                window.location.reload();
              });
            }
          })
          .catch((error) => {
            if (error) {
              const { status, responseBody } = error?.response?.data;
              if (status === 400) {
                toast.error("Bad request. Check and retry.");
              } else if (status === 404) {
                toast.error("Resources not available.");
              } else if (status === 500) {
                toast.error(responseBody.errorDescription);
              } else if (status === "EXPIRED_ACCESS") {
                toast.error(responseBody.errorDescription);
                const promise = RefreshToken();
                promise.then((resp) => {
                  const { accessToken, refreshToken } = resp.data.responseBody;
                  sessionStorage.setItem("token", JSON.stringify(accessToken));
                  sessionStorage.setItem(
                    "refreshToken",
                    JSON.stringify(refreshToken)
                  );
                  window.location.reload();
                });
              } else {
                toast.error(responseBody.errorDescription);
              }
            }
          });
      } else if (userName && !mobileNumber && scope !== "SUPER_ADMINISTRATOR") {
        // const id = JSON.parse(sessionStorage.getItem("authData")).clientId;
        const promise = FetchInfoWithUsername();
        toast.promise(promise, {
          loading: "Fetching data",
          success: "fetched successfully",
          error: "Fetching failed",
        });
        promise
          .then((response) => {
            const { responseBody } = response?.data;
            dispatch(actions.updateUserInfo(responseBody));
            if (responseBody.errorCode === "EXPIRED_ACCESS") {
              toast.error(responseBody.errorDescription);
              const promise = RefreshToken();
              promise.then((resp) => {
                const { accessToken, refreshToken } = resp.data.responseBody;
                sessionStorage.setItem("token", JSON.stringify(accessToken));
                sessionStorage.setItem(
                  "refreshToken",
                  JSON.stringify(refreshToken)
                );
                window.location.reload();
              });
            }
          })
          .catch((error) => {
            if (error) {
              const { status, responseBody } = error?.response?.data;
              if (status === 400) {
                toast.error("Bad request. Check and retry.");
              } else if (status === 404) {
                toast.error("Resources not available.");
              } else if (status === 500) {
                toast.error(responseBody.errorDescription);
              } else if (status === "EXPIRED_ACCESS") {
                toast.error(responseBody.errorDescription);
                const promise = RefreshToken();
                promise.then((resp) => {
                  const { accessToken, refreshToken } = resp.data.responseBody;
                  sessionStorage.setItem("token", JSON.stringify(accessToken));
                  sessionStorage.setItem(
                    "refreshToken",
                    JSON.stringify(refreshToken)
                  );
                  window.location.reload();
                });
              } else {
                toast.error(responseBody.errorDescription);
              }
            }
          });
      }
    }
  }, [dispatch]);

  useEffect(() => {
    // Get wallet informations
    const promise = GetWalletDetails();
    toast.promise(promise, {
      loading: "Fetching wallet details",
      success: "fetched successfully",
      error: "Fetching failed",
    });
    promise
      .then((response) => {
        const { responseBody } = response?.data;

        if (
          JSON.parse(sessionStorage.getItem("selectedScope")).accessType ===
          "CREDIT_UNION_ADMINISTRATOR"
        ) {
          const mainWallet = responseBody.filter(
            (eachWallet) => eachWallet.walletType === "MAIN"
            // ||
            // eachWallet.walletType === "CUSTODY"
          );
          setWallet(mainWallet);
          props.setWallet(mainWallet);
        } else if (
          JSON.parse(sessionStorage.getItem("selectedScope")).accessType ===
          "CREDIT_UNION_BRANCH_OFFICER"
        ) {
          const mainWallet = responseBody.filter(
            (eachWallet) => eachWallet.walletType === "MAIN"
          );
          setWallet(mainWallet[0]);
        }
      })
      .catch((error) => {
        if (error) {
          const { status, responseBody } = error?.response?.data;
          if (status === 400) {
            toast.error("Bad request. Check and retry.");
          } else if (status === 404) {
            toast.error("Resources not available.");
          } else if (status === 500) {
            toast.error(responseBody.errorDescription);
          } else if (status === "EXPIRED_ACCESS") {
            toast.error(responseBody.errorDescription);
            const promise = RefreshToken();
            promise.then((resp) => {
              const { accessToken, refreshToken } = resp.data.responseBody;
              sessionStorage.setItem("token", JSON.stringify(accessToken));
              sessionStorage.setItem(
                "refreshToken",
                JSON.stringify(refreshToken)
              );
              window.location.reload();
            });
          } else {
            toast.error(responseBody.errorDescription);
          }
        }
      });
  }, []);

  return (
    <>
      {props.isRightSidebarVisible && (
        <div className="right-content sm:block fixed z-20 top-16 sm:top-0 right-0 sm:relative w-[240px] h-screen bg-purple-50 p-4">
          <nav className="flex justify-start">
            <Avatar
              alt={user?.userInfo?.firstName}
              src="/static/images/avatar/1.jpg"
            />
            <div className="px-2">
              {JSON.parse(sessionStorage.getItem("selectedScope"))
                .accessType === "CREDIT_UNION_BRANCH_OFFICER" && (
                <>
                  <h5 className="leading-4 font-semibold">{`${user?.userInfo?.firstName} ${user?.userInfo?.lastName}`}</h5>
                  <p className="text-sm text-gray-400">Branch Officer</p>
                </>
              )}
              {JSON.parse(sessionStorage.getItem("selectedScope"))
                .accessType === "CREDIT_UNION_ADMINISTRATOR" && (
                <>
                  <h5 className="leading-4 font-semibold">{`${user?.userInfo?.username}`}</h5>
                  <p className="text-sm text-gray-400">Credit Union Admin</p>
                </>
              )}
            </div>
          </nav>
          <div className="card shadow p-4 hover:shadow-xl w-full mt-8 h-auto rounded-lg bg-white">
            <h4 className="text-lg text-primary-theme font-medium mb-4">
              Wallet Information
            </h4>
            {JSON.parse(sessionStorage.getItem("selectedScope")).accessType ===
              "CREDIT_UNION_BRANCH_OFFICER" && (
              <>
                <p className="title text-xs uppercase text-gray-400 leading-3">
                  Account number
                </p>
                <h5 className="text-sm mt-1">{wallet?.accountNumber}</h5>

                {/* <p className="title text-xs mt-3 uppercase text-gray-400 leading-3">
              Wallet ID
            </p>
            <h5 className="text-sm mt-1 w-44 flex items-center justify-center truncate relative">
              {wallet?.id}
              <span onClick={()=> {
                window.navigator.clipboard.writeText(wallet?.id);
                toast.success("Copied successfully");
              }} className="py-1 absolute right-0 px-3 text-xs bg-primary-theme text-white rounded">copy</span>
            </h5> */}

                <p className="title text-xs mt-3 uppercase text-gray-400 leading-3">
                  Wallet balance
                </p>
                <h5 className="text-sm mt-1">
                  {Formatter(wallet?.availableBalance)}
                </h5>
              </>
            )}

            {JSON.parse(sessionStorage.getItem("selectedScope")).accessType ===
              "CREDIT_UNION_ADMINISTRATOR" && (
              <>
                <p className="title text-xs uppercase text-gray-400 leading-3">
                  Main account number
                </p>
                <h5 className="text-sm mt-1">
                  {wallet && wallet[0]?.accountNumber}
                </h5>

                {/* <p className="title text-xs mt-3 uppercase text-gray-400 leading-3">
              Wallet ID
            </p>
            <h5 className="text-sm mt-1 w-44 flex items-center justify-center truncate relative">
              {wallet && wallet[0].id}
              <span onClick={()=> {
                window.navigator.clipboard.writeText(wallet[0]?.id);
                toast.success("Copied successfully");
              }} className="py-1 absolute right-0 px-3 text-xs bg-primary-theme text-white rounded">copy</span>
            </h5> */}

                <p className="title text-xs mt-3 uppercase text-gray-400 leading-3">
                  Main allet balance
                </p>
                <h5 className="text-sm mt-1">
                  {Formatter(wallet && wallet[0]?.availableBalance)}
                </h5>

                {/* <hr className="my-3" />

            <p className="title text-xs uppercase text-gray-400 leading-4">
              Custody account number
            </p>
            <h5 className="text-sm mt-1">
              {wallet && wallet[1]?.accountNumber}
            </h5>

            <p className="title text-xs mt-3 uppercase text-gray-400 leading-3">
              Custody allet balance
            </p>
            <h5 className="text-sm mt-1">
              {Formatter(wallet && wallet[1]?.availableBalance)}
            </h5> */}
              </>
            )}
          </div>

          <div className="card shadow p-4 hover:shadow-xl w-full mt-8 h-auto rounded-lg bg-white">
            <h4 className="text-lg text-primary-theme font-medium mb-4">
              User Information
            </h4>
            <p className="title text-xs uppercase text-gray-400 leading-3">
              Organization Name
            </p>
            <h5 className="text-sm mt-1">{user.userInfo.organizationName}</h5>

            <p className="title text-xs mt-3 uppercase text-gray-400 leading-3">
              Role Name
            </p>
            <h5 className="text-sm mt-1">{user.userInfo.roleName}</h5>

            <p className="title text-xs mt-3 uppercase text-gray-400 leading-3">
              {user?.userInfo?.mobileNumber ? "Mobile Number" : "Username"}
            </p>
            <h5 className="text-sm mt-1">
              {user?.userInfo?.mobileNumber
                ? user.userInfo.mobileNumber
                : user.userInfo.username}
            </h5>

            {JSON.parse(sessionStorage.getItem("selectedScope")).accessType !==
              "CREDIT_UNION_ADMINISTRATOR" && (
              <Link
                to="/branch-officer/transaction"
                className="text-center h-12 font-thin text-sm rounded-xl flex justify-center items-center bg-primary-theme text-white w-full mt-2"
              >
                View all transactions
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default RightSidebar;
