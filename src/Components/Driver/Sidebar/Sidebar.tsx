import { Avatar, Text } from "@mantine/core";
import { IconLayoutDashboard, IconUser, IconTruck, IconHeartbeat, IconCashBanknote } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { getUserProfile } from "../../../Service/UserService"; // Keep for other roles
import { getDriverByUser } from "../../../Service/DriverService"; // ✅ Import this
import useProtectedImage from "../../Utilities/hook/useProtectedImage";

const links = [
  { name: "Dashboard", url: "/driver/dashboard", icon: <IconLayoutDashboard stroke={1.5} /> },
  { name: "Profile", url: "/driver/profile", icon: <IconUser stroke={1.5} /> },
  { name: "Bookings", url: "/driver/bookings", icon: <IconTruck stroke={1.5} /> },
    { name: "My Salary", url: "/driver/salary", icon: <IconCashBanknote stroke={1.5} /> },
];

const Sidebar = () => {
  const user = useSelector((state: any) => state.user);
  const [picId, setPicId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    // ✅ FIX: If role is DRIVER, use the working 'by-user' endpoint
    if (user.role === "DRIVER") {
      getDriverByUser(user.id)
        .then((data) => {
            // Driver service returns full object, extract the ID
            setPicId(data.profilePictureId); 
        })
        .catch((err: any) => console.log("Error fetching driver picture:", err));
    } 
    // ✅ Keep existing logic for Doctors/Patients (if their IDs are correct)
    else {
      getUserProfile(user.id)
        .then((data) => setPicId(data))
        .catch((err: any) => console.log("Error fetching profile picture:", err));
    }
  }, [user]);

  const url = useProtectedImage(picId);

  return (
    <div className="flex">
      <div className="w-64" />
      <div className="bg-darks fixed h-screen overflow-y-auto w-64 flex flex-col gap-7 items-center">
        {/* Logo Section */}
        <div className="fixed z-[500] py-3 bg-darks text-primary-400 flex gap-1 items-center">
            <IconHeartbeat size={40} stroke={2.5} />
            <span className="font-heading font-semibold text-3xl">Pulse</span>
        </div>

        {/* Profile Info */}
        <div className="flex flex-col mt-20 gap-6.5">
          <div className="flex flex-col gap-1 items-center">
            <div className="p-1 bg-white rounded-full shadow-xl">
              <Avatar variant="filled" src={url} size="xl" alt="Profile" />
            </div>
            <span className="font-medium text-light">{user?.name}</span>
            <Text className="text-light" c="dimmed" size="xs">
              {user?.role}
            </Text>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col gap-3">
            {links.map((link) => (
              <NavLink
                to={link.url}
                key={link.url}
                className={({ isActive }) =>
                  `flex items-center gap-3 w-full text-light font-medium px-4 py-5 rounded-lg ${
                    isActive ? "bg-primary-400 text-darks" : "hover:bg-gray-100 hover:text-darks"
                  }`
                }
              >
                {link.icon}
                <span>{link.name}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;