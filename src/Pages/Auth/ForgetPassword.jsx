import { Button } from "@mui/material";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { IMAGES } from "../../Assets";
import { LoginBtn } from "../../Components/Button/Button";
import Metatag from "../../Layouts/Metatag/Metatag";
import toast, { Toaster } from "react-hot-toast";
import { PasswordInput, TextInput } from "../../Components/Input/Input";
import { useState } from "react";
import { GetOTP, RetrievePassword } from "../../Services/Auth/ForgetPwd";

function ForgetPassword() {
  const navigateTo = useNavigate();
  const [isOTPSent, setIsOTPSent] = useState(false);
  const [payload, setPayload] = useState({
    username: "gamteluser",
  });

  const sendOTPHandler = async () => {
    if (payload.username) {
      const data = {
        identity: {
          identity: payload.username,
          identityType: "USERNAME",
        },
      };
      try {
        const otpResponse = await GetOTP(data);
        toast.success("OTP has been sent to your email.");
        setIsOTPSent(true);
      } catch (error) {
        toast.error(error.response.data.responseBody.errorDescription);
      }
    } else {
      toast.error("Email is required");
    }
  };

  const recoverPasswordHandler = async () => {
    if (payload.otp && payload.password) {
      const data = {
        identity: {
          identity: payload.username,
          identityType: "USERNAME",
        },
        otp: payload.otp,
        credential: payload.password,
        confirmCredential: payload.password,
        credentialType: "PASSWORD",
      };
      try {
        const otpResponse = await RetrievePassword(data);
        toast.success("Password retrieved succesfully.");
        navigateTo("/login");
      } catch (error) {
        toast.error(error.response.data.responseBody.errorDescription);
      }
    } else {
      toast.error("All fields are required");
    }
  };
  return (
    <Metatag title={"Forget Password"}>
      <Toaster position="top-right" />
      <div className="w-full h-screen flex flex-col md:flex-row">
        <div className="pb-10 md:w-[400px] lg:w-[500px] h-full shadow bg-primary-theme">
          <nav className="w-full flex justify-center items-start md:p-10">
            <img src={IMAGES.Logo} className="w-24 mt-14" alt="" />
          </nav>
          <h3 className="text-xl md:text-3xl text-center px-10 text-white mt-10 font-light hidden md:flex flex-col">
            <span>Welcome to</span>
            <span className="md:mt-5 w-1/2 md:w-full mx-auto ...">
              National Association of Cooperative Credit Unions of The Gambia.
            </span>
          </h3>
        </div>
        <div className="md:w-[calc(100%_-_400px)] lg:w-[calc(100%_-_500px)] shadow">
          <div className="px-8 sm:px-20 pt-16">
            <h4 className="text-2xl">Forget Password.</h4>
            <p className="text-gray-500 text-sm">Reset your password</p>
            <div className="md:4/5 lg:w-3/5 my-4 ...">
              {!isOTPSent ? (
                <div>
                  <TextInput
                    type="username"
                    name="username"
                    value={payload.username}
                    onChange={(e) =>
                      setPayload({
                        ...payload,
                        username: e.target.value,
                      })
                    }
                    label={"Username"}
                    className="w-full"
                  />
                  <button
                    onClick={sendOTPHandler}
                    className="w-full h-12 flex items-center justify-center bg-primary-theme text-white rounded-md"
                  >
                    Get OTP
                  </button>
                </div>
              ) : (
                <div>
                  <p className="text-gray-500">
                    OTP has been sent to{" "}
                    <span className="text-black">{payload.username}</span> copy
                    the OTP from your email to complete your change of password.
                  </p>
                  <TextInput
                    type="number"
                    name="otp"
                    value={payload.otp}
                    onChange={(e) =>
                      setPayload({
                        ...payload,
                        otp: e.target.value,
                      })
                    }
                    label={"OTP"}
                    className="w-full"
                  />
                  <PasswordInput
                    type="password"
                    name="password"
                    value={payload.password}
                    onChange={(e) =>
                      setPayload({
                        ...payload,
                        password: e.target.value,
                      })
                    }
                    label={"New Password"}
                    className="w-full"
                  />

                  <button
                    onClick={recoverPasswordHandler}
                    className="w-full h-12 flex items-center justify-center bg-primary-theme text-white rounded-md"
                  >
                    Recover Password
                  </button>
                </div>
              )}
              <div className="py-4">
                <p>
                  <Link className="text-primary-theme" to="/login">
                    Login to your account here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Metatag>
  );
}

export default ForgetPassword;
