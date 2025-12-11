import { Paper, Group, ThemeIcon, Text } from "@mantine/core";

interface KpiCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
    description?: string;
}

const KpiCard = ({ title, value, icon, color, description }: KpiCardProps) => {
    return (
        <Paper withBorder radius="md" p="md" className="shadow-sm hover:shadow-md transition-shadow">
            <Group>
                <ThemeIcon color={color} variant="light" size={50} radius="md">
                    {icon}
                </ThemeIcon>
                <div>
                    <Text c="dimmed" tt="uppercase" fw={700} size="xs">
                        {title}
                    </Text>
                    <Text fw={700} size="xl">
                        {value}
                    </Text>
                    {description && <Text size="xs" c="dimmed">{description}</Text>}
                </div>
            </Group>
        </Paper>
    );
};

export default KpiCard;