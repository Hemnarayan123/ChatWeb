import React from "react";
import { useAuth } from "../../context/AuthProvider.jsx";
import Logout from "./Logout";

const Profile = () => {
    const [authUser] = useAuth();

  if (!authUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className=" flex p-4 bg-green-800">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 rounded-full overflow-hidden text-white">
          <img src={authUser.user.avatar} alt={authUser.user.fullname} />
        </div>
        <div>
          <h1 className="text-xl font-bold">{authUser.user.fullname}</h1>
          <p className="text-white">{authUser.user.email}</p>
        </div>
      </div>
      <div>
        <Logout />
        </div>
    </div>
  );
};

export default Profile;
