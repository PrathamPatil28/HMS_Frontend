import { Menu, Avatar, Text, rem, UnstyledButton, Group } from "@mantine/core";
import {
  IconSettings,
  IconLogout,
  IconUser,
  IconChevronRight,
} from "@tabler/icons-react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDriverByUser } from "../../Service/DriverService"; 
import { getUserProfile } from "../../Service/UserService";
import useProtectedImage from "../Utilities/hook/useProtectedImage";
import { removeJwt } from "../../Slices/JwtSlice";
import { removeUser } from "../../Slices/UserSlice";

const ProfileMenu = () => {
  const user = useSelector((state: any) => state.user);
  const [picId, setPicId] = useState<string | null>(null);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.id) return;

    if (user.role === "ADMIN") {
        return;
    }

    if (user.role === "DRIVER") {
      getDriverByUser(user.id)
        .then((data) => setPicId(data.profilePictureId))
        .catch((err) => console.error("Driver fetch error:", err));
    } else {
      getUserProfile(user.id)
        .then((data) => setPicId(data))
        .catch((err) => console.error("User fetch error:", err));
    }
  }, [user]);

  const url = useProtectedImage(picId);

  const handleLogout = () => {
    dispatch(removeJwt());
    dispatch(removeUser());
    navigate("/login");
  };

  return (
    <Menu shadow="md" width={260} position="bottom-end" transitionProps={{ transition: 'pop-top-right' }}>
      <Menu.Target>
        <UnstyledButton className="group">
            <Group gap={10}>
                <Avatar 
                    src={url} 
                    radius="xl" 
                    size={40} 
                    color="blue" 
                    className="transition-transform group-hover:scale-105 shadow-sm"
                />
                <div className="hidden md:block text-left leading-4">
                    <Text size="sm" fw={600} className="text-gray-700 dark:text-gray-200">{user.name}</Text>
                    <Text size="xs" c="dimmed" className="capitalize">{user.role?.toLowerCase()}</Text>
                </div>
                <IconChevronRight size={16} className="text-gray-400 dark:text-gray-500 group-hover:text-gray-600 transition-colors" />
            </Group>
        </UnstyledButton>
      </Menu.Target>

      <Menu.Dropdown className="dark:bg-gray-800 dark:border-gray-700">
        {/* User Info Header inside Dropdown */}
        <div className="px-3 py-2 bg-gray-50 dark:bg-gray-900 border-b dark:border-gray-700 mb-2">
            <Text size="sm" fw={600} className="dark:text-gray-200">{user.name}</Text>
            <Text size="xs" c="dimmed" className="break-all">{user.email}</Text>
        </div>

        <Menu.Label>Settings</Menu.Label>
        
        <Menu.Item 
            className="dark:text-gray-200 dark:hover:bg-gray-700"
            leftSection={<IconUser style={{ width: rem(16), height: rem(16) }} />}
            onClick={() => navigate('/patient/profile')} 
        >
          My Profile
        </Menu.Item>

        <Menu.Item 
            className="dark:text-gray-200 dark:hover:bg-gray-700"
            leftSection={<IconSettings style={{ width: rem(16), height: rem(16) }} />}
        >
          Account Settings
        </Menu.Item>

        <Menu.Divider className="dark:border-gray-700" />

        <Menu.Item 
          color="red" 
          className="dark:hover:bg-gray-900"
          leftSection={<IconLogout style={{ width: rem(16), height: rem(16) }} />}
          onClick={handleLogout}
        >
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default ProfileMenu;