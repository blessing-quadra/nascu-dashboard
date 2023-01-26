import { Button } from "@mui/material";
import React from "react";
import toast from "react-hot-toast";
import { PasswordInput, TextInput } from "../../Components/Input/Input";
import SelectInput from "../../Components/Select/Select";
import { RegisterNewMember } from "../../Services/User/User";

const styles = {
  registerBtn: {
    backgroundColor: "#0F5499",
    color: "#FFFFFF",
    padding: "12px 20px",
    fontWeight: "400",
    textTransform: "capitalize",
  },
};

function RegisterUserOverlay(props) {
  const hideOverlay = (e) => {
    if (e.target.classList.contains("overlay")) {
      props.setShowOverlay(false);
    }
  };

  const registerHandler = () => {
    const promise = RegisterNewMember(props.data);
    toast.promise(promise, {
      loading: "Processing...",
      success: "User registered successfully",
      error: "User registered failed",
    });
    promise
      .then((response) => {
        // const { responseBody } = response.data;
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      })
      .catch((error) => {
        if (error?.response) {
          const { status } = error?.response;
          if (status === 400) {
            toast.error(error?.response?.data?.responseBody?.errorDescription);
            // toast.error("Bad request. Check and retry.");
          } else if (status === 404) {
            toast.error("Resources not available.");
          } else if (status === 500) {
            toast.error("Server error. Please retry.");
          } else {
            toast.error("Strange Error occured. Try again");
          }
        } else {
          toast.error(error.message);
        }
      });
  };
  return (
    <div
      onClick={hideOverlay}
      className="overlay overflow-y-scroll flex items-start justify-center py-6 w-full h-screen bg-[#00000070] fixed top-0 left-0 z-10"
    >
      <div className="w-[550px] h-auto bg-white rounded shadow">
        <div className="p-4">
          <h4 className="text-lg font-semibold pt-5 pb-4">
            {JSON.parse(sessionStorage.getItem("selectedScope")).accessType ===
              "CREDIT_UNION_ADMINISTRATOR" &&
              "Register new User and Assign Role"}

            {JSON.parse(sessionStorage.getItem("selectedScope")).accessType ===
              "CREDIT_UNION_BRANCH_OFFICER" &&
              "Register new Credit Union Member"}
          </h4>
          <TextInput
            value={props.data.firstName}
            onChange={(e) =>
              props.setData({
                ...props.data,
                firstName: e.target.value,
              })
            }
            label={"First name"}
            className="w-full"
          />
          <TextInput
            label={"Last name"}
            value={props.data.lastName}
            onChange={(e) =>
              props.setData({
                ...props.data,
                lastName: e.target.value,
              })
            }
            className="w-full"
          />

          <TextInput
            value={props.data.mobileNumber}
            type={"number"}
            onChange={(e) =>
              props.setData({
                ...props.data,
                mobileNumber: e.target.value,
              })
            }
            label={"Mobile number"}
            className="w-full"
          />
          <SelectInput
            className="w-full"
            value={props.data.gender}
            label={"Gender"}
            options={[
              { label: "Male", value: "MALE" },
              { label: "Female", value: "FEMALE" },
            ]}
            onChange={(e) =>
              props.setData({
                ...props.data,
                gender: e.target.value,
              })
            }
          />
          <SelectInput
            className="w-full"
            value={props.data.maritalStatus}
            label={"Marital Status"}
            options={[
              { label: "Single", value: "SINGLE" },
              { label: "Married", value: "MARRIED" },
            ]}
            onChange={(e) =>
              props.setData({
                ...props.data,
                maritalStatus: e.target.value,
              })
            }
          />
          <TextInput
            value={props.data.employeeId}
            type={"number"}
            onChange={(e) =>
              props.setData({
                ...props.data,
                employeeId: e.target.value,
              })
            }
            label={"Employee ID"}
            className="w-full"
          />
          <TextInput
            value={props.data.organizationMemberId}
            type={"number"}
            onChange={(e) =>
              props.setData({
                ...props.data,
                organizationMemberId: e.target.value,
              })
            }
            label={"Organisation Member ID"}
            className="w-full"
          />
          {JSON.parse(sessionStorage.getItem("selectedScope")).accessType ===
            "CREDIT_UNION_ADMINISTRATOR" && (
            <>
              <SelectInput
                className="w-full"
                // value={props.data.organizationId}
                label={"Credit Union Name"}
                options={[props.organizationData]}
                onChange={(e) =>
                  props.setData({
                    ...props.data,
                    organizationMemberId: e.target.value,
                  })
                }
              />

              <SelectInput
                className="w-full"
                // value={props.data.organizationId}
                label={"Role ID"}
                options={props.rolesData}
                onChange={(e) =>
                  props.setData({
                    ...props.data,
                    roleId: e.target.value,
                  })
                }
              />
            </>
          )}
          {JSON.parse(sessionStorage.getItem("selectedScope")).accessType ===
            "CREDIT_UNION_BRANCH_OFFICER" && (
            <>
              {/* <TextInput
                value={props.data.username}
                onChange={(e) =>
                  props.setData({
                    ...props.data,
                    username: e.target.value,
                  })
                }
                label={"Username"}
                className="w-full"
              /> */}

              <TextInput
                value={props.data.email}
                onChange={(e) =>
                  props.setData({
                    ...props.data,
                    emailAddress: e.target.value,
                  })
                }
                label={"Email address"}
                className="w-full"
              />

              <TextInput
                value={props.organizationData.label}
                // onChange={(e) =>
                //   props.setData({
                //     ...props.data,
                //     employeeId: e.target.value,
                //     organizationMemberId: e.target.value,
                //   })
                // }
                label={"Organisation ID"}
                className="w-full"
              />
            </>
          )}

          <PasswordInput
            value={props.data.password}
            onChange={(e) =>
              props.setData({
                ...props.data,
                password: e.target.value,
              })
            }
            label={"Password"}
            type={"password"}
            className="w-full"
          />
          <Button onClick={registerHandler} style={styles.registerBtn}>
            Register Credit Union Member
          </Button>
        </div>
      </div>
    </div>
  );
}

export default RegisterUserOverlay;
