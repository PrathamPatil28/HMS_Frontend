import { Tabs } from "@mantine/core";
import { IconDroplet, IconUsers, IconClipboardHeart } from "@tabler/icons-react";
import BloodInventory from "../../Components/Admin/BloodBank/BloodInventory";
import DonorManager from "../../Components/Admin/BloodBank/DonorManager";
import RequestManager from "../../Components/Admin/BloodBank/RequestManager";


const AdminBloodBankPage = () => {
  return (
    <div className="p-5">
      <h1 className="text-2xl font-heading font-bold text-primary-500 mb-6">Blood Bank Administration</h1>
      
      <Tabs defaultValue="inventory" color="red" variant="pills" radius="md">
        <Tabs.List className="bg-white p-2 rounded-lg shadow-sm mb-5">
          <Tabs.Tab value="inventory" leftSection={<IconDroplet size={18} />}>
            Inventory
          </Tabs.Tab>
          <Tabs.Tab value="donors" leftSection={<IconUsers size={18} />}>
            Donors
          </Tabs.Tab>
          <Tabs.Tab value="requests" leftSection={<IconClipboardHeart size={18} />}>
            Requests
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="inventory">
          <BloodInventory />
        </Tabs.Panel>

        <Tabs.Panel value="donors">
          <DonorManager />
        </Tabs.Panel>

        <Tabs.Panel value="requests">
          <RequestManager />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};

export default AdminBloodBankPage;