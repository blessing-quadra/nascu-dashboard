import React, { useState } from "react";
import { IMAGES } from "../../Assets";
import { LoginBtn } from "../../Components/Button/Button";
import { PasswordInput, TextInput } from "../../Components/Input/Input";
// import AuthFormContainer from "../../Layouts/AuthForm/AuthFormContainer";
import Metatag from "../../Layouts/Metatag/Metatag";
import toast, { Toaster } from "react-hot-toast";
import {
  LoginHandlerOthers,
  LoginHandlerSuperAdmin,
} from "../../Utils/Auth/LoginUtils";
import { styles } from "./styles.js";
import { Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigateTo = useNavigate();
  const [activeSectionTab, setActiveSectionTab] = useState("others"); //USERNAME - for super-admin
  const [loginPayload, setLoginPayload] = useState({
    identity: "", //2209234567
    password: "",
  });
  const [loginPayload2, setLoginPayload2] = useState({
    identity: "",
    password: "",
  });

  // const [loginPayload, setLoginPayload] = useState({
  //   identity: "2209299968", //2209234567
  //   password: "ABc123456!",
  // });
  // const [loginPayload2, setLoginPayload2] = useState({
  //   identity: "gamteluser",
  //   password: "ABc123456!",
  // });

  const branchOfficerLoginHandler = () => {
    if (loginPayload.identity && loginPayload.password) {
      const promise = LoginHandlerOthers(loginPayload);
      toast.promise(promise, {
        loading: "Authenticating...",
        success: "Login successfully",
        error: "Failed",
      });
      promise
        .then((response) => {
          const { responseBody } = response.data;
          // toast.promise(promise, {
          //   loading: "Authenticating...",
          //   success: responseDescription,
          //   error: "Failed",
          // });
          window.sessionStorage.setItem(
            "mobileNumber",
            JSON.stringify(loginPayload.identity)
          );
          window.sessionStorage.setItem(
            "authData",
            JSON.stringify(responseBody)
          );
          navigateTo("/gateway");
        })
        .catch((error) => {
          if (error?.response) {
            const { status } = error?.response;
            if (status === 400) {
              toast.error("Bad request. Check and retry.");
            } else if (status === 404) {
              toast.error("Resources not available.");
            } else if (status === 500) {
              toast.error("Server error. Please retry.");
            } else {
              toast.error("Error occured. Try again");
            }
          } else {
            toast.error(error.message);
          }
        });
    } else {
      toast.error("All fields are required");
    }
  };

  const adminLoginHandler = () => {
    if (loginPayload2.identity && loginPayload2.password) {
      const promise = LoginHandlerSuperAdmin(loginPayload2);
      toast.promise(promise, {
        loading: "Authenticating...",
        success: "Login successfully",
        error: "Failed",
      });
      promise
        .then((response) => {
          const { responseBody } = response.data;
          window.sessionStorage.setItem(
            "authData",
            JSON.stringify(responseBody)
          );
          window.sessionStorage.setItem(
            "userName",
            JSON.stringify(loginPayload2.identity)
          );
          navigateTo("/gateway");
        })
        .catch((error) => {
          if (error?.response) {
            const { status } = error?.response;
            if (status === 400) {
              toast.error("Bad request. Check and retry.");
            } else if (status === 404) {
              toast.error("Resources not available.");
            } else if (status === 500) {
              toast.error("Server error. Please retry.");
            } else {
              toast.error("Error occured. Try again");
            }
          } else {
            toast.error(error.message);
          }
        });
    } else {
      toast.error("All fields are required");
    }
  };

  return (
    <Metatag title={"Login"}>
      <Toaster position="top-right" />
      <div className="w-full h-screen flex flex-col md:flex-row">
        <div className="pb-10 md:w-[400px] lg:w-[500px] h-full shadow bg-primary-theme">
          <nav className="w-full flex justify-center items-start md:p-10">
            <img src={IMAGES.Logo} className="w-64 mt-14" alt="" />
          </nav>
          <h3 className="text-xl md:text-3xl text-center px-10 text-white mt-10 font-light hidden md:flex flex-col">
            <span>Welcome to</span>
            <span className="md:mt-5 w-1/2 md:w-full mx-auto ...">
              National Association of Savings and Credit Unions of Zambia.
            </span>
          </h3>
        </div>
        <div className="md:w-[calc(100%_-_400px)] lg:w-[calc(100%_-_500px)] shadow">
          <div className="section-tab px-8 sm:px-20 py-8">
            <div className="md:4/5 lg:w-3/5 h-16 flex flex-wrap gap-4 items-center justify-between ...">
              <Button
                onClick={() => setActiveSectionTab("superadmin")}
                style={
                  activeSectionTab === "superadmin"
                    ? styles.ActiveTab
                    : styles.ToggleTab
                }
              >
                Admin Users
              </Button>
              <Button
                onClick={() => setActiveSectionTab("others")}
                style={
                  activeSectionTab === "others"
                    ? styles.ActiveTab
                    : styles.ToggleTab
                }
              >
                Other Users
              </Button>
            </div>
          </div>
          {activeSectionTab === "others" && (
            <div className="px-8 sm:px-20 pt-5">
              <h4 className="text-2xl">Log in.</h4>
              <p className="text-gray-500 text-sm">
                You can log in as a branch officer here.
              </p>
              <div className="md:4/5 lg:w-3/5 my-4 ...">
                <TextInput
                  type="number"
                  value={loginPayload.identity}
                  onChange={(e) =>
                    setLoginPayload({
                      ...loginPayload,
                      identity: e.target.value,
                    })
                  }
                  label={"Phone number"}
                  className="w-full"
                />
                <PasswordInput
                  value={loginPayload.password}
                  onChange={(e) =>
                    setLoginPayload({
                      ...loginPayload,
                      password: e.target.value,
                    })
                  }
                  label={"Password"}
                  className="w-full"
                />
                <LoginBtn
                  disabled={
                    loginPayload.identity && loginPayload.password
                      ? false
                      : true
                  }
                  onClick={branchOfficerLoginHandler}
                  style={styles.LoginBtn}
                  text={"Login as branch officer"}
                />

                <div className="py-4">
                  <p>
                    <Link className="text-primary-theme" to="/forget-password">
                      Retrieve your forgotten password
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          )}
          {activeSectionTab === "superadmin" && (
            <div className="px-8 sm:px-20 pt-5">
              <h4 className="text-2xl">Log in.</h4>
              <p className="text-gray-500 text-sm">
                You can log in as a super admin here.
              </p>
              <div className="md:4/5 lg:w-3/5 my-4 ...">
                <TextInput
                  value={loginPayload2.identity}
                  onChange={(e) =>
                    setLoginPayload2({
                      ...loginPayload2,
                      identity: e.target.value,
                    })
                  }
                  label={"Username"}
                  className="w-full"
                />
                <PasswordInput
                  value={loginPayload2.password}
                  onChange={(e) =>
                    setLoginPayload2({
                      ...loginPayload2,
                      password: e.target.value,
                    })
                  }
                  label={"Password"}
                  className="w-full"
                />
                <LoginBtn
                  disabled={
                    loginPayload2.identity && loginPayload2.password
                      ? false
                      : true
                  }
                  onClick={adminLoginHandler}
                  style={styles.LoginBtn}
                  text={"Login as Super Admin"}
                />
              </div>
              <div className="py-4">
                <p>
                  <Link className="text-primary-theme" to="/forget-password">
                    Retrieve your forgotten password
                  </Link>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Metatag>
  );
}

export default Login;
