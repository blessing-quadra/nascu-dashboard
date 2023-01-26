import { Button } from "@mui/material";
import React from "react";
import toast from "react-hot-toast";
import { TextInput } from "../../Components/Input/Input";
import SelectInput from "../../Components/Select/Select";
import { createNewRoleService } from "../../Services/Role/Role";

const styles = {
  registerBtn: {
    backgroundColor: "#0F5499",
    color: "#FFFFFF",
    padding: "12px 20px",
    fontWeight: "400",
    textTransform: "capitalize",
  },
};

function CreateRoleOverlay(props) {
  const hideOverlay = (e) => {
    if (e.target.classList.contains("overlay")) {
      props.setShowOverlay(false);
    }
  };

  const createNewRole = () => {
    const promise = createNewRoleService(props.data);

    promise.then(() => {
      toast.success("Role successfully created.");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    });
  };
  return (
    <div
      onClick={hideOverlay}
      className="overlay overflow-y-scroll flex items-start justify-center py-6 w-full h-screen bg-[#00000070] fixed top-0 left-0 z-10"
    >
      <div className="w-[550px] h-auto bg-white rounded shadow">
        <div className="p-4">
          <h4 className="text-lg font-semibold pt-5 pb-4">Create new Role</h4>
          <TextInput
            value={props.data.name}
            type={"text"}
            onChange={(e) =>
              props.setData({
                ...props.data,
                name: e.target.value,
              })
            }
            label={"Role Name"}
            className="w-full"
          />
          <SelectInput
            className="w-full"
            value={props.data.accessType}
            label={"Access Type"}
            options={[
              {
                label: "CREDIT UNION MEMBER",
                value: "CREDIT_UNION_MEMBER",
              },
              {
                label: "CREDIT UNION AGENT",
                value: "CREDIT_UNION_AGENT",
              },
              {
                label: "CREDIT UNION BRANCH OFFICER",
                value: "CREDIT_UNION_BRANCH_OFFICER",
              },
              {
                label: "CREDIT UNION ADMINISTRATOR",
                value: "CREDIT_UNION_ADMINISTRATOR",
              },
              {
                label: "CREDIT UNION FINANCIAL ADMINISTRATOR",
                value: "CREDIT_UNION_FINANCIAL_ADMINISTRATOR",
              },
            ]}
            onChange={(e) =>
              props.setData({
                ...props.data,
                accessType: e.target.value,
              })
            }
          />
          <TextInput
            value={props.data.description}
            onChange={(e) =>
              props.setData({
                ...props.data,
                description: e.target.value,
              })
            }
            label={"Description message"}
            className="w-full"
          />
          <Button onClick={createNewRole} style={styles.registerBtn}>
            Create Role
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CreateRoleOverlay;
