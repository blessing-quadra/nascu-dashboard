import { Button } from "@mui/material";
import React from "react";
import toast from "react-hot-toast";
import { PasswordInput, TextInput } from "../../Components/Input/Input";
import SelectInput from "../../Components/Select/Select";
import { CreateNewOrganisation } from "../../Services/Organization/Organization";

const styles = {
  registerBtn: {
    backgroundColor: "#0F5499",
    color: "#FFFFFF",
    padding: "12px 20px",
    fontWeight: "400",
    textTransform: "capitalize",
  },
};

function CreateOrganisation(props) {
  const hideOverlay = (e) => {
    if (e.target.classList.contains("overlay")) {
      props.setShowOverlay(false);
    }
  };

  const createOrganisation = () => {
    // console.log(props.data);
    const promise = CreateNewOrganisation(props.data);
    toast.promise(promise, {
      loading: "Processing...",
      success: "Organization registration successful",
      error: "Organization creation failed",
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
            Create a new organisation
          </h4>
          <TextInput
            value={props.data.name}
            onChange={(e) =>
              props.setData({
                ...props.data,
                name: e.target.value,
              })
            }
            label={"Organisation Name"}
            className="w-full"
          />
          <TextInput
            label={"Description"}
            value={props.data.description}
            onChange={(e) =>
              props.setData({
                ...props.data,
                description: e.target.value,
              })
            }
            className="w-full"
          />

          <TextInput
            value={props.data.username}
            type={"text"}
            onChange={(e) =>
              props.setData({
                ...props.data,
                username: e.target.value,
              })
            }
            label={"Username"}
            className="w-full"
          />
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
          <TextInput
            value={props.data.emailAddress}
            type={"email"}
            onChange={(e) =>
              props.setData({
                ...props.data,
                emailAddress: e.target.value,
              })
            }
            label={"Email address"}
            className="w-full"
          />
          {props.data.organizationType === "CREDIT_UNION" && (
            <SelectInput
              className="w-full"
              value={props.data.registrationRoleName}
              label={"Registration Role Name"}
              options={[
                {
                  label: "Platform Administrator Member Level 1",
                  value: "Platform Administrator Member Level 1",
                },
                {
                  label: "Partner Administrator Member Level 1",
                  value: "Partner Administrator Member Level 1",
                },
                {
                  label: "Credit Union Member Level 1",
                  value: "Credit Union Member Level 1",
                },
              ]}
              onChange={(e) =>
                props.setData({
                  ...props.data,
                  registrationRoleName: e.target.value,
                })
              }
            />
          )}
          <SelectInput
            className="w-full"
            value={props.data.administratorRoleName}
            label={"Administrator Role Name"}
            options={[
              {
                label: "Platform Administrator Role Level 1",
                value: "Platform Administrator Role Level 1",
              },
              {
                label: "Partner Administrator Role Level 1",
                value: "Partner Administrator Role Level 1",
              },
              {
                label: "Credit Union Administrator Role Level 1",
                value: "Credit Union Administrator Role Level 1",
              },
            ]}
            onChange={(e) =>
              props.setData({
                ...props.data,
                administratorRoleName: e.target.value,
              })
            }
          />
          <SelectInput
            className="w-full"
            value={props.data.organizationType}
            label={"Organization Type"}
            options={[
              { label: "PLATFORM", value: "PLATFORM" },
              { label: "PARTNER", value: "PARTNER" },
              { label: "CREDIT UNION", value: "CREDIT_UNION" },
            ]}
            onChange={(e) =>
              props.setData({
                ...props.data,
                organizationType: e.target.value,
              })
            }
          />

          <TextInput
            value={props.data.address}
            type={"text"}
            onChange={(e) =>
              props.setData({
                ...props.data,
                address: e.target.value,
              })
            }
            label={"Address"}
            className="w-full"
          />
          <TextInput
            value={props.data.externalId}
            type={"number"}
            onChange={(e) =>
              props.setData({
                ...props.data,
                externalId: e.target.value,
              })
            }
            label={"External ID"}
            className="w-full"
          />

          <TextInput
            value={props.data.shortName}
            type={"text"}
            onChange={(e) =>
              props.setData({
                ...props.data,
                shortName: e.target.value,
              })
            }
            label={"Short Name"}
            className="w-full"
          />

          {/* <SelectInput
            className="w-full"
            value={props.data.shortName}
            label={"Short Name"}
            options={[
              {
                label: "Quadra Platform",
                value: "quadraplatform",
              },
              {
                label: "Gambia Partners",
                value: "gambiapartners",
              },
              {
                label: "Partner Administrator Role Level 1",
                value: "Partner Administrator Role Level 1",
              },
            ]}
            onChange={(e) =>
              props.setData({
                ...props.data,
                shortName: e.target.value,
              })
            }
          /> */}

          <Button onClick={createOrganisation} style={styles.registerBtn}>
            Create Organisation
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CreateOrganisation;
