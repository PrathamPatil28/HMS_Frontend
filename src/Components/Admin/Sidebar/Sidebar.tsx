import { Avatar, Text, Drawer, Tooltip } from "@mantine/core"; // Removed ScrollArea from usage
import { 
    IconAmbulance, IconBed, IconDroplet, IconFlask, IconHeartbeat, 
    IconLayoutGrid, IconMoodHeart, IconPackages, IconPill, 
    IconReceipt2, IconReceiptRupee, IconStethoscope, IconCashBanknote 
} from "@tabler/icons-react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

const links = [
    { name: "Dashboard", url: "/admin/dashboard", icon: <IconLayoutGrid stroke={1.5} /> },
    { name: "Doctors", url: "/admin/doctor", icon: <IconStethoscope stroke={1.5} /> },
    { name: "Patients", url: "/admin/patients", icon: <IconMoodHeart stroke={1.5} /> },
    { name: "Ambulance", url: "/admin/ambulance", icon: <IconAmbulance stroke={1.5} /> },
    { name: "Medicine", url: "/admin/medicine", icon: <IconPill stroke={1.5} /> },
    { name: "Inventory", url: "/admin/inventory", icon: <IconPackages stroke={1.5} /> },
    { name: "Blood Bank", url: "/admin/blood-bank", icon: <IconDroplet stroke={1.5} /> },
    { name: "Lab Tests", url: "/admin/lab-tests", icon: <IconFlask stroke={1.5} /> },
    { name: "Room Allotment", url: "/admin/room-allotment", icon: <IconBed stroke={1.5} /> },
    { name: "Sales", url: "/admin/sales", icon: <IconReceiptRupee stroke={1.5} /> },
    { name: "Billing", url: "/admin/billing", icon: <IconReceipt2 stroke={1.5} /> },
    { name: "Payroll", url: "/admin/payroll", icon: <IconCashBanknote stroke={1.5} /> },
];

interface SidebarProps {
    mobileOpened: boolean;
    closeMobile: () => void;
    desktopCollapsed: boolean;
}

const Sidebar = ({ mobileOpened, closeMobile, desktopCollapsed }: SidebarProps) => {
    const user = useSelector((state: any) => state.user);

    useEffect(() => {
        // console.log(user);
    });

    // This component renders the actual content inside the Sidebar/Drawer
    const SidebarContent = ({ isCollapsed }: { isCollapsed?: boolean }) => (
        // Added h-full, overflow-hidden to parent to contain the scrollable child
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
                        <Avatar variant='filled' src="/Pratham3.jpeg" size={isCollapsed ? 'md' : 'xl'} alt='User Avatar' />
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
            {/* flex-1: takes remaining height. overflow-y-auto: scrolls vertically. no-scrollbar: hides visual bar */}
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

                        // If collapsed, wrap in tooltip for better UX
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
                    body: 'h-full p-0 flex-1 overflow-hidden' // overflow-hidden here prevents double scrollbars
                }}
            >
                <SidebarContent isCollapsed={false} />
            </Drawer>
        </>
    );
}

export default Sidebar;