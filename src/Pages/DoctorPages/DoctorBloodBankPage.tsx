import { Tabs } from "@mantine/core";
import { IconDroplet, IconClipboardHeart } from "@tabler/icons-react";
import BloodAvailability from "../../Components/Doctor/BloodBank/BloodAvailability";
import RequestBlood from "../../Components/Doctor/BloodBank/RequestBlood";

const DoctorBloodPage = () => {
    return (
        <div className="p-5">
            <h1 className="text-2xl font-heading font-bold text-primary-500 mb-6">Blood Bank Services</h1>

            <Tabs defaultValue="request" color="red" variant="pills" radius="md">
                <Tabs.List className="bg-white p-2 rounded-lg shadow-sm mb-5">
                    <Tabs.Tab value="request" leftSection={<IconClipboardHeart size={18} />}>
                        Request Blood
                    </Tabs.Tab>
                    <Tabs.Tab value="availability" leftSection={<IconDroplet size={18} />}>
                        Check Availability
                    </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="request">
                    <RequestBlood />
                </Tabs.Panel>

                <Tabs.Panel value="availability">
                    <BloodAvailability />
                </Tabs.Panel>
            </Tabs>
        </div>
    );
};

export default DoctorBloodPage;