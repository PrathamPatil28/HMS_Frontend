import { useEffect, useState } from "react";
import { Card,  Text, Loader, Center,  RingProgress } from "@mantine/core";
import { getAllBloodUnits, BloodUnitDTO } from "../../../Service/BloodBankService";

const BloodAvailability = () => {
    const [units, setUnits] = useState<BloodUnitDTO[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAllBloodUnits()
            .then(setUnits)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    // Helper to count available units per group
    const getCount = (group: string) => units.filter(u => u.bloodGroup === group && u.status === "AVAILABLE").length;

    const groups = ["A_POSITIVE", "A_NEGATIVE", "B_POSITIVE", "B_NEGATIVE", "O_POSITIVE", "O_NEGATIVE", "AB_POSITIVE", "AB_NEGATIVE"];

    if (loading) return <Center h={200}><Loader /></Center>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {groups.map(group => {
                const count = getCount(group);
                const color = count > 5 ? "green" : count > 0 ? "orange" : "red";
                
                return (
                    <Card key={group} shadow="sm" padding="lg" radius="md" withBorder className="flex flex-col items-center">
                        <Text fw={700} size="lg" className="text-neutral-700 mb-2">
                            {group.replace("_", " ")}
                        </Text>
                        <RingProgress
                            size={100}
                            thickness={10}
                            roundCaps
                            sections={[{ value: (count / 10) * 100, color: color }]}
                            label={
                                <Text c={color} fw={700} ta="center" size="xl">
                                    {count}
                                </Text>
                            }
                        />
                        <Text size="xs" c="dimmed" mt="sm">Units Available</Text>
                    </Card>
                );
            })}
        </div>
    );
};

export default BloodAvailability;