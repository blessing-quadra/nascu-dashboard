import { Button } from "@mui/material";
import React from "react";
import toast from "react-hot-toast";
import { PasswordInput, TextInput } from "../../Components/Input/Input";
import SelectInput from "../../Components/Select/Select";
import { RegisterNewMember, UpdateMemberStatus } from "../../Services/User/User";

const styles = {
  registerBtn: {
    backgroundColor: "#0F5499",
    color: "#FFFFFF",
    padding: "12px 20px",
    fontWeight: "400",
    textTransform: "capitalize",
  },
};

function MembershipInfoOverlay(props) {
  const hideOverlay = (e) => {
    if (e.target.classList.contains("overlay")) {
      props.setShowOverlay(false);
    }
  };

  const updateUserState = () => {
    const payload = {
      id: props?.data?.mobileNumber,
      type: "MSISDN",
      status: props?.data?.status?.value,
    };
    const promise = UpdateMemberStatus(payload);

    toast.promise(promise, {
      loading: "Processing...",
      success: "Status updated successfully",
      error: "Status update failed",
    });
    promise
      .then((response) => {
        // const { responseBody } = response.data;
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      })
      .catch((error) => {
        // alert(JSON.stringify(error.response))
        if (error?.response) {
          const { status, data } = error?.response;
          if (status === 400) {
            toast.error("Bad request. Check and retry.");
          } else if (status === 404) {
            toast.error("Resources not available.");
          } else if (status === 500) {
            toast.error(data.responseBody.errorDescription);
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
          <h4 className="text-lg font-semibold pt-5 pb-1">User information</h4>
          <p className="text-sm text-gray-400 mb-5">
            You can update the status of this user by selecting the right user
            status in the select field below
          </p>
          <p className="text-gray-400 text-sm">Mobile Number</p>
          <h className="text-sm uppercase">{props?.data?.mobileNumber}</h>

          <p className="text-gray-400 mt-3 text-sm">Fullname</p>
          <h5 className="text-sm mb-4 uppercase">{props?.data?.fullname}</h5>
          <SelectInput
            className="w-full"
            value={props?.data?.status?.value}
            label={"User Status"}
            options={[
              { label: "Active", value: "ACTIVE" },
              { label: "Blocked", value: "BLOCKED" },
              { label: "Closed", value: "CLOSED" },
              { label: "Registered", value: "REGISTERED" },
            ]}
            onChange={(e) =>
              props.setData({
                ...props.data,
                status: {
                  label: e.target.value,
                  value: e.target.value,
                },
              })
            }
          />

          <Button onClick={updateUserState} style={styles.registerBtn}>
            Update Status
          </Button>
        </div>
      </div>
    </div>
  );
}

export default MembershipInfoOverlay;
