import { Tabs } from "@mantine/core";
import { IconAmbulance, IconHistory, IconPlus } from "@tabler/icons-react";
import RequestAmbulancePatient from "../../Components/Patient/Ambulance/RequestAmbulancePatient";
import PatientBookingHistory from "../../Components/Patient/Ambulance/PatientBookingHistory";
import PatientAvailableList from "../../Components/Patient/Ambulance/PatientAvailableList";



const PatientAmbulancePage = () => {
    return (
        <div className="p-5">
            <h1 className="text-2xl font-heading font-bold text-primary-500 mb-6">Ambulance Services</h1>

            <Tabs defaultValue="request" color="cyan" variant="pills" radius="md">
                <Tabs.List className="bg-white p-2 rounded-lg shadow-sm mb-5">
                    <Tabs.Tab value="request" leftSection={<IconPlus size={18} />}>
                        Book Ambulance
                    </Tabs.Tab>
                    <Tabs.Tab value="history" leftSection={<IconHistory size={18} />}>
                        My History
                    </Tabs.Tab>
                    <Tabs.Tab value="available" leftSection={<IconAmbulance size={18} />}>
                        Available Fleet
                    </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="request">
                    <RequestAmbulancePatient />
                </Tabs.Panel>

                <Tabs.Panel value="history">
                    <PatientBookingHistory />
                </Tabs.Panel>

                <Tabs.Panel value="available">
                    <PatientAvailableList />
                </Tabs.Panel>
            </Tabs>
        </div>
    );
};

export default PatientAmbulancePage;