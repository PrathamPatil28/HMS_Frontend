import { ActionIcon, Indicator, Menu } from "@mantine/core"; // Removed 'Button'
import { IconBellRinging, IconLayoutSidebarLeftCollapseFilled } from "@tabler/icons-react";
import ProfileMenu from "./ProfileMenu";
import { useDispatch, useSelector } from "react-redux";

import { addNotification, markAllRead } from "../../Slices/NotificationSlice";

import { successNotification } from "../../util/NotificationUtil";
import useNotificationSocket from "../../Hook/useNotificationSocket";
import { useRef } from "react";

const Header = () => {
  const jwt = useSelector((state: any) => state.jwt);
  const user = useSelector((state: any) => state.user);
  const { unreadCount, list } = useSelector((s: any) => s.notifications);

  const dispatch = useDispatch();
  
  // Create a set to store IDs of notifications we already showed
  const processedIds = useRef(new Set());

  useNotificationSocket(user?.id, (msg) => {
    // Check if we already showed this specific Message ID
    if (processedIds.current.has(msg.id)) {
        console.log("🚫 Duplicate notification blocked:", msg.id);
        return;
    }

    // Add to the set so we don't show it again
    processedIds.current.add(msg.id);

    console.log("✅ Showing notification:", msg.id);
    dispatch(addNotification(msg));
    successNotification(msg.message);
  });

  // Commented out because it is not used in the JSX below
  /* 
  const handleLogout = () => {
    dispatch(removeJwt());
    dispatch(removeUser());
  }; 
  */

  return (
    <div className="bg-light shadow-lg w-full h-16 flex justify-between px-5 items-center">
      <ActionIcon size="lg" variant="transparent">
        <IconLayoutSidebarLeftCollapseFilled style={{ width: "90%", height: "90%" }} stroke={1.5} />
      </ActionIcon>

      <div className="flex gap-5 items-center">

        {jwt && (
          <Menu shadow="md" width={260}>
            <Menu.Target>
              <Indicator color="red" disabled={unreadCount === 0} label={unreadCount}>
                <ActionIcon size="lg" variant="transparent">
                  <IconBellRinging size={28} />
                </ActionIcon>
              </Indicator>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label>Notifications</Menu.Label>

              {list.length === 0 ? (
                <Menu.Item disabled>No notifications</Menu.Item>
              ) : (
                list.slice(0, 5).map((n: any, i: number) => (
                  <Menu.Item key={i} onClick={() => dispatch(markAllRead())}>
                    {n.message}
                  </Menu.Item>
                ))
              )}

              <Menu.Divider />
              <Menu.Item onClick={() => dispatch(markAllRead())}>Mark all as read</Menu.Item>
            </Menu.Dropdown>
          </Menu>
        )}

        {/* 
          Since this section is commented out, we removed the 
          handleLogout function and imports above to prevent Build Errors.
        */}
        {/* {jwt ? (
          <Button onClick={handleLogout} color="red.8">Logout</Button>
        ) : (
          <Link to={"/login"}><Button>Login</Button></Link>
        )} */}

        {jwt && <ProfileMenu />}
      </div>
    </div>
  );
};

export default Header;