import { Tabs, Title, Text } from "@mantine/core";
import { IconAmbulance, IconSteeringWheel, IconNotebook } from "@tabler/icons-react";
import AmbulanceManager from "../../Components/Admin/Ambulance/AmbulanceManager";
import DriverManager from "../../Components/Admin/Ambulance/DriverManager";
import BookingManager from "../../Components/Admin/Ambulance/BookingManager";

const AdminAmbulancePage = () => {
  return (
    <div className="w-full min-h-screen p-4 md:p-6 transition-colors duration-300">
      
      {/* Page Header */}
      <div className="mb-6">
        <Title order={2} className="font-heading text-neutral-800 dark:text-white">
          Ambulance Command Center
        </Title>
        <Text c="dimmed" size="sm">
          Dispatch units, manage fleet availability, and track driver rosters.
        </Text>
      </div>
      
      {/* Navigation Tabs */}
      <Tabs defaultValue="bookings" variant="pills" radius="md" color="blue">
        <Tabs.List className="bg-white dark:bg-gray-800 p-1.5 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6 overflow-x-auto flex-nowrap">
          <Tabs.Tab 
            value="bookings" 
            leftSection={<IconNotebook size={18} />}
            className="data-[active]:bg-blue-50 dark:data-[active]:bg-blue-900/30 transition-all"
          >
            Live Bookings
          </Tabs.Tab>
          
          <Tabs.Tab 
            value="fleet" 
            leftSection={<IconAmbulance size={18} />}
            className="data-[active]:bg-blue-50 dark:data-[active]:bg-blue-900/30 transition-all"
          >
            Vehicle Fleet
          </Tabs.Tab>
          
          <Tabs.Tab 
            value="drivers" 
            leftSection={<IconSteeringWheel size={18} />}
            className="data-[active]:bg-blue-50 dark:data-[active]:bg-blue-900/30 transition-all"
          >
            Driver Roster
          </Tabs.Tab>
        </Tabs.List>

        {/* Tab Panels with Fade Animation */}
        <div className="animate-fade-in">
            <Tabs.Panel value="bookings">
                <BookingManager />
            </Tabs.Panel>

            <Tabs.Panel value="fleet">
                <AmbulanceManager />
            </Tabs.Panel>

            <Tabs.Panel value="drivers">
                <DriverManager />
            </Tabs.Panel>
        </div>
      </Tabs>
    </div>
  );
};

export default AdminAmbulancePage;