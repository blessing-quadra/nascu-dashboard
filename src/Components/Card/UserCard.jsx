import { Avatar } from "@mui/material";
import React from "react";

function UserCard({ key, name, role, time }) {
    
  return (
    <div
      className={`${
        key % 2 === 0 ? "bg-gray-200" : ""
      } py-3 flex items-center justify-between`}
    >
      <Avatar alt={name} />
      <h5 className="text-md text-gray-500">{name}</h5>
      <h5 className="text-md text-gray-500">{role}</h5>
      <h5 className="text-md text-gray-500">1.24PM</h5>
    </div>
  );
}

export default UserCard;
