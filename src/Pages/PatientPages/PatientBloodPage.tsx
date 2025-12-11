import { useState } from "react";
import { Tabs } from "@mantine/core";
import { IconDroplet, IconHistory, IconClipboardHeart } from "@tabler/icons-react"; // Added IconClipboardHeart
import DonorRegistration from "../../Components/Patient/BloodBank/DonorRegistration";
import DonationHistory from "../../Components/Patient/BloodBank/DonationHistory";
import EligibilityRules from "../../Components/Patient/BloodBank/EligibilityRules";
import RequestBloodPatient from "../../Components/Patient/BloodBank/RequestBloodPatient"; // Import the new component

const PatientBloodPage = () => {
    const [donorId, setDonorId] = useState<number | null>(null);

    return (
        <div className="p-5">
            <h1 className="text-2xl font-heading font-bold text-primary-500 mb-6">Blood Bank Services</h1>

            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
             

                <div className="lg:col-span-2">
                    <Tabs defaultValue="request" color="red" variant="pills" radius="md">
                        <Tabs.List className="bg-white p-2 rounded-lg shadow-sm mb-5">
                            {/* New Request Tab */}
                            <Tabs.Tab value="request" leftSection={<IconClipboardHeart size={18} />}>
                                Request Blood
                            </Tabs.Tab>
                            <Tabs.Tab value="register" leftSection={<IconDroplet size={18} />}>
                                Donor Profile
                            </Tabs.Tab>
                            <Tabs.Tab value="history" leftSection={<IconHistory size={18} />}>
                                Donation History
                            </Tabs.Tab>
                        </Tabs.List>

                        {/* New Panel */}
                        <Tabs.Panel value="request">
                            <RequestBloodPatient />
                        </Tabs.Panel>

                        <Tabs.Panel value="register">
                            <DonorRegistration onDonorRegistered={setDonorId} />
                        </Tabs.Panel>

                        <Tabs.Panel value="history">
                            <DonationHistory donorId={donorId} />
                        </Tabs.Panel>
                    </Tabs>
                </div>

                   <div className="lg:col-span-1">
                    <EligibilityRules />
                </div>
            </div>
        </div>
    );
};

export default PatientBloodPage;