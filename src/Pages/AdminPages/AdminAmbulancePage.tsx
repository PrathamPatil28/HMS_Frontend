import { Tabs } from "@mantine/core";
import { IconAmbulance, IconSteeringWheel, IconNotebook } from "@tabler/icons-react";
import AmbulanceManager from "../../Components/Admin/Ambulance/AmbulanceManager";
import DriverManager from "../../Components/Admin/Ambulance/DriverManager";
import BookingManager from "../../Components/Admin/Ambulance/BookingManager";

const AdminAmbulancePage = () => {
  return (
    <div className="p-5">
      <h1 className="text-2xl font-heading font-bold text-primary-500 mb-6">Ambulance Management System</h1>
      
      <Tabs defaultValue="bookings" color="cyan" variant="pills" radius="md">
        <Tabs.List className="bg-white p-2 rounded-lg shadow-sm mb-5">
          <Tabs.Tab value="bookings" leftSection={<IconNotebook size={18} />}>
            Bookings
          </Tabs.Tab>
          <Tabs.Tab value="fleet" leftSection={<IconAmbulance size={18} />}>
            Ambulance Fleet
          </Tabs.Tab>
          <Tabs.Tab value="drivers" leftSection={<IconSteeringWheel size={18} />}>
            Drivers
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="bookings">
          <BookingManager />
        </Tabs.Panel>

        <Tabs.Panel value="fleet">
          <AmbulanceManager />
        </Tabs.Panel>

        <Tabs.Panel value="drivers">
          <DriverManager />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};

export default AdminAmbulancePage;