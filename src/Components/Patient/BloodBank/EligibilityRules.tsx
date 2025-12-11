import { Accordion, Card, Text, ThemeIcon, List } from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";

const EligibilityRules = () => {
    return (
        <Card padding="lg" radius="md" withBorder>
            <Text size="xl" fw={700} mb="md" c="red">Donation Eligibility Criteria</Text>
            
            <Accordion variant="separated">
                <Accordion.Item value="basic">
                    <Accordion.Control icon={<IconCheck size={20} color="green"/>}>
                        Basic Requirements
                    </Accordion.Control>
                    <Accordion.Panel>
                        <List spacing="xs" size="sm" center icon={<ThemeIcon color="teal" size={24} radius="xl"><IconCheck size={16} /></ThemeIcon>}>
                            <List.Item>Age must be between 18 and 65 years.</List.Item>
                            <List.Item>Weight must be at least 50 kg (110 lbs).</List.Item>
                            <List.Item>Must be in good general health and feeling well.</List.Item>
                            <List.Item>Pulse rate between 50 and 100 beats/min.</List.Item>
                        </List>
                    </Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item value="deferral">
                    <Accordion.Control icon={<IconX size={20} color="red"/>}>
                        Temporary Deferrals (Cannot Donate)
                    </Accordion.Control>
                    <Accordion.Panel>
                        <List spacing="xs" size="sm" center icon={<ThemeIcon color="red" size={24} radius="xl"><IconX size={16} /></ThemeIcon>}>
                            <List.Item>Cold, flu, or sore throat on donation day.</List.Item>
                            <List.Item>Dental work within the last 24 hours.</List.Item>
                            <List.Item>Pregnancy (wait 6 months after delivery).</List.Item>
                            <List.Item>Recent tattoo or piercing (wait 6 months).</List.Item>
                        </List>
                    </Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item value="frequency">
                    <Accordion.Control>How often can I donate?</Accordion.Control>
                    <Accordion.Panel>
                        <Text size="sm">You must wait at least 56 days (8 weeks) between whole blood donations.</Text>
                    </Accordion.Panel>
                </Accordion.Item>
            </Accordion>
        </Card>
    );
};

export default EligibilityRules;