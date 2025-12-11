import { Avatar, Text } from "@mantine/core"
import { 
    IconAmbulance, 
    IconBed,  
    IconDroplet, 
    IconFlask, 
    IconHeartbeat, 
    IconLayoutGrid, 
    IconMoodHeart, 
    IconPackages, 
    IconPill, 
    IconReceipt2, 
    IconReceiptRupee, 
    IconStethoscope, 
    IconCashBanknote // ✅ Imported new icon for Payroll
} from "@tabler/icons-react"
import { useEffect } from "react"
import { useSelector } from "react-redux"
import { NavLink } from "react-router-dom"

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
    { name: "Payroll", url: "/admin/payroll", icon: <IconCashBanknote stroke={1.5} /> }, // ✅ Added Payroll Link
]

const Sidebar = () => {

    const user = useSelector((state: any) => state.user);

    useEffect(() => {
        // console.log(user);
    })

    return (
        <div className="flex">
            <div className="w-64"></div>
            
            <div className="bg-darks fixed h-screen overflow-y-auto w-64 flex flex-col gap-6 items-center no-scrollbar">
                
                <div className="fixed z-[500] py-3 bg-darks text-primary-400 flex gap-1 items-center">
                    <IconHeartbeat size={40} stroke={2.5} />
                    <span className="font-heading font-semibold text-3xl">Pulse</span>
                </div>

                <div className="flex flex-col mt-20 gap-6.5">

                    <div className="flex flex-col gap-1 items-center">
                        <div className="p-1 bg-white rounded-full shadow-xl">
                            <Avatar variant='filled' src="/Pratham3.jpeg" size={'xl'} alt='User Avatar' />
                        </div>
                        <span className="font-medium text-light">{user.name}</span>
                        <Text className="text-light" c={"dimmed"} size="xs">{user.role}</Text>
                    </div>
                    <div className="flex flex-col gap-3 pb-6"> {/* Added pb-6 for scrolling space */}
                        {
                            links.map((link) => {
                                return <NavLink to={link.url} key={link.url}
                                    className={({ isActive }) => `flex items-center gap-3 !w-full text-light font-medium px-4 py-3 rounded-lg transition-colors
                  ${isActive ? "bg-primary-400 text-darks" : "hover:bg-gray-100 hover:text-darks"}`
                                    }>
                                    {link.icon}
                                    <span>{link.name}</span>

                                </NavLink>
                            })
                        }
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Sidebar