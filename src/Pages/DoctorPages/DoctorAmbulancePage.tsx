import { Tabs } from "@mantine/core";
import { IconAmbulance, IconHistory, IconPlus } from "@tabler/icons-react";
import RequestAmbulance from "../../Components/Doctor/Ambulance/RequestAmbulance";
import AvailableList from "../../Components/Doctor/Ambulance/AvailableList";
import MyBookings from "../../Components/Doctor/Ambulance/MyBookings";


const DoctorAmbulancePage = () => {
    return (
        <div className="p-5">
            <h1 className="text-2xl font-heading font-bold text-primary-500 mb-6">Ambulance Services</h1>

            <Tabs defaultValue="request" color="cyan" variant="pills" radius="md">
                <Tabs.List className="bg-white p-2 rounded-lg shadow-sm mb-5">
                    <Tabs.Tab value="request" leftSection={<IconPlus size={18} />}>
                        Request Ambulance
                    </Tabs.Tab>
                    <Tabs.Tab value="available" leftSection={<IconAmbulance size={18} />}>
                        Available Fleet
                    </Tabs.Tab>
                    <Tabs.Tab value="history" leftSection={<IconHistory size={18} />}>
                        Patient History
                    </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="request">
                    <RequestAmbulance />
                </Tabs.Panel>

                <Tabs.Panel value="available">
                    <AvailableList />
                </Tabs.Panel>

                <Tabs.Panel value="history">
                    <MyBookings />
                </Tabs.Panel>
            </Tabs>
        </div>
    );
};

export default DoctorAmbulancePage;