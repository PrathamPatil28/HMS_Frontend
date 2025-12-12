import { Avatar, Text, Drawer, Tooltip } from "@mantine/core"
import { IconAmbulance, IconCalendarCheck, IconDroplet, IconFileInvoiceFilled, IconHeartbeat, IconLayoutGrid, IconReceipt2, IconTestPipe, IconUser } from "@tabler/icons-react"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { NavLink } from "react-router-dom"

import useProtectedImage from "../../Utilities/hook/useProtectedImage.tsx";
import { getUserProfile } from "../../../Service/UserService.ts"

const links = [
  { name: "Dashboard", url: "/patient/dashboard", icon: <IconLayoutGrid stroke={1.5} /> },
  { name: "Profile", url: "/patient/profile", icon: <IconUser stroke={1.5} /> },
  { name: "Appointments", url: "/patient/appointment", icon: <IconCalendarCheck stroke={1.5} /> },
  { name: "Prescription", url: "/patient/prescription", icon: <IconFileInvoiceFilled stroke={1.5} /> },
  { name: "Ambulance", url: "/patient/ambulance", icon: <IconAmbulance stroke={1.5} /> },
  { name: "Blood Bank", url: "/patient/blood-bank", icon: <IconDroplet stroke={1.5} /> },
  { name: "Lab Reports", url: "/patient/lab-reports", icon: <IconTestPipe stroke={1.5} /> },
  { name: "My Bills", url: "/patient/billing", icon: <IconReceipt2 stroke={1.5} /> },
  { name: "Room Booking", url: "/patient/room-booking", icon: <IconHeartbeat stroke={1.5} /> }
]

interface SidebarProps {
    mobileOpened: boolean;
    closeMobile: () => void;
    desktopCollapsed: boolean;
}

const Sidebar = ({ mobileOpened, closeMobile, desktopCollapsed }: SidebarProps) => {

  const user = useSelector((state: any) => state.user);
  const [picId, setPicId] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    getUserProfile(user.id)
      .then((data) => setPicId(data))
      .catch((err: any) => console.log("Error fetching profile picture:", err))
  }, [user])

  const url = useProtectedImage(picId)

  const SidebarContent = ({ isCollapsed }: { isCollapsed?: boolean }) => (
    // ✅ Added overflow-hidden to parent to handle inner scroll properly
    <div className="bg-darks h-full w-full flex flex-col overflow-hidden">
        
        {/* --- FIXED HEADER SECTION (Logo & User) --- */}
        {/* shrink-0 prevents this section from collapsing when scrolling happens */}
        <div className="shrink-0 flex flex-col items-center">
            {/* Logo */}
            <div className={`py-4 bg-darks text-primary-400 flex gap-1 items-center justify-center transition-all duration-300 ${isCollapsed ? 'px-2' : ''}`}>
                <IconHeartbeat size={isCollapsed ? 30 : 40} stroke={2.5} />
                {!isCollapsed && <span className="font-heading font-semibold text-3xl transition-opacity duration-300">Pulse</span>}
            </div>

            {/* User Profile */}
            <div className={`flex flex-col gap-1 items-center mt-6 mb-4 transition-all duration-300 ${isCollapsed ? 'px-2' : ''}`}>
                <div className="p-1 bg-white rounded-full shadow-xl">
                    <Avatar variant="filled" src={url} size={isCollapsed ? 'md' : 'xl'} alt="Profile" />
                </div>
                
                {!isCollapsed && (
                    <div className="text-center transition-opacity duration-300 animate-fade-in">
                        <span className="font-medium text-light block">{user.name}</span>
                        <Text className="text-light" c={"dimmed"} size="xs">{user.role}</Text>
                    </div>
                )}
            </div>
        </div>

        {/* --- SCROLLABLE LINKS SECTION --- */}
        {/* flex-1 fills remaining space, overflow-y-auto enables scrolling */}
        <div className="flex-1 overflow-y-auto px-2 pb-6 no-scrollbar overflow-x-hidden">
            <div className="flex flex-col gap-2">
                {links.map((link) => {
                    const content = (
                        <NavLink 
                            to={link.url} 
                            key={link.url}
                            onClick={closeMobile}
                            className={({ isActive }) => `flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'} gap-3 w-full text-light font-medium px-3 py-3 rounded-lg transition-all duration-200
                            ${isActive ? "bg-primary-400 text-darks" : "hover:bg-gray-700/50 hover:text-white"}`
                            }
                        >
                            <div className="shrink-0">
                                {link.icon}
                            </div>
                            {!isCollapsed && <span className="whitespace-nowrap overflow-hidden text-ellipsis">{link.name}</span>}
                        </NavLink>
                    );

                    return isCollapsed ? (
                        <Tooltip label={link.name} position="right" key={link.url} withArrow>
                            <div>{content}</div>
                        </Tooltip>
                    ) : content;
                })}
            </div>
        </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`hidden md:flex flex-col h-screen bg-darks transition-all duration-300 ease-in-out shrink-0 ${desktopCollapsed ? 'w-20' : 'w-64'}`}>
         <SidebarContent isCollapsed={desktopCollapsed} />
      </div>

      {/* Mobile Drawer */}
      <Drawer 
          opened={mobileOpened} 
          onClose={closeMobile} 
          size="75%" 
          padding={0}
          withCloseButton={false}
          className="md:hidden"
          transitionProps={{ transition: 'slide-right', duration: 250 }}
          // ✅ KEY FIX: Using classNames to force full height and handle scrolling internally
          classNames={{
             root: 'md:hidden',
             content: 'h-full flex flex-col',
             body: 'h-full p-0 flex-1 overflow-hidden'
          }}
      >
          <SidebarContent isCollapsed={false} />
      </Drawer>
    </>
  )
}

export default Sidebar