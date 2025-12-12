import { ActionIcon, Indicator, Menu, useMantineColorScheme, useComputedColorScheme } from "@mantine/core"; 
import { IconBellRinging, IconLayoutSidebarLeftCollapseFilled, IconSun, IconMoon, IconMenu2 } from "@tabler/icons-react";
import ProfileMenu from "./ProfileMenu";
import { useDispatch, useSelector } from "react-redux";
import { addNotification, markAllRead } from "../../Slices/NotificationSlice";
import { successNotification } from "../../util/NotificationUtil";
import useNotificationSocket from "../../Hook/useNotificationSocket";
import { useRef } from "react";

interface HeaderProps {
    toggleSidebar: () => void;
}

const Header = ({ toggleSidebar }: HeaderProps) => {
  const jwt = useSelector((state: any) => state.jwt);
  const user = useSelector((state: any) => state.user);
  const { unreadCount, list } = useSelector((s: any) => s.notifications);

  const dispatch = useDispatch();
  
  // Dark Mode Hooks
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

  const processedIds = useRef(new Set());

  useNotificationSocket(user?.id, (msg) => {
    if (processedIds.current.has(msg.id)) {
        return;
    }
    processedIds.current.add(msg.id);
    dispatch(addNotification(msg));
    successNotification(msg.message);
  });

  return (
    <div className="bg-light dark:bg-gray-800 dark:border-b dark:border-gray-700 shadow-lg w-full h-16 flex justify-between px-5 items-center transition-colors duration-300 shrink-0 z-20">
      
      {/* Sidebar Toggle Button */}
        {/* Sidebar Toggle Button */}
      <ActionIcon size="lg" variant="transparent" onClick={toggleSidebar} className="text-gray-700 dark:text-gray-200">
        
        {/* ✅ Hamburger Icon: Visible on Mobile, Hidden on Desktop */}
        <IconMenu2 
            className="block md:hidden" 
            style={{ width: "90%", height: "90%" }} 
            stroke={1.5} 
        />

        {/* ✅ Collapse Icon: Hidden on Mobile, Visible on Desktop */}
        <IconLayoutSidebarLeftCollapseFilled 
            className="hidden md:block" 
            style={{ width: "90%", height: "90%" }} 
            stroke={1.5} 
        />
        
      </ActionIcon>
      <div className="flex gap-4 md:gap-5 items-center">

        {/* Dark Mode Toggle */}
        <ActionIcon
            onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
            variant="default"
            size="lg"
            aria-label="Toggle color scheme"
            className="border-none shadow-none bg-transparent"
        >
          {computedColorScheme === 'dark' ? (
              <IconSun stroke={1.5} className="text-yellow-400" />
          ) : (
              <IconMoon stroke={1.5} className="text-blue-600" />
          )}
        </ActionIcon>

        {jwt && (
          <Menu shadow="md" width={260}>
            <Menu.Target>
              <Indicator color="red" disabled={unreadCount === 0} label={unreadCount}>
                <ActionIcon size="lg" variant="transparent" className="text-gray-700 dark:text-gray-200">
                  <IconBellRinging size={28} />
                </ActionIcon>
              </Indicator>
            </Menu.Target>

            <Menu.Dropdown className="dark:bg-gray-800 dark:border-gray-700">
              <Menu.Label>Notifications</Menu.Label>

              {list.length === 0 ? (
                <Menu.Item disabled>No notifications</Menu.Item>
              ) : (
                list.slice(0, 5).map((n: any, i: number) => (
                  <Menu.Item key={i} onClick={() => dispatch(markAllRead())} className="dark:text-gray-200 dark:hover:bg-gray-700">
                    {n.message}
                  </Menu.Item>
                ))
              )}

              <Menu.Divider className="dark:border-gray-600" />
              <Menu.Item onClick={() => dispatch(markAllRead())} className="dark:text-gray-200 dark:hover:bg-gray-700">Mark all as read</Menu.Item>
            </Menu.Dropdown>
          </Menu>
        )}

        {jwt && <ProfileMenu />}
      </div>
    </div>
  );
};

export default Header;