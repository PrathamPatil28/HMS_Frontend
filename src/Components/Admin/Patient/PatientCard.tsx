import { Avatar, Card, Text, Group, Badge, Stack, Grid, Box } from "@mantine/core";
import {
  IconMail,
  IconPhone,
  IconCalendar,
  IconMapPin,
  IconId,
  IconDroplet,
  IconHeartbeat,
  IconAlignLeft,
} from "@tabler/icons-react";
import {  formatDateAppShort } from "../../../util/DateFormat";
import { bloodGroupMap } from "../../../util/Helper";

const PatientCard = ({
  name,
  email,
  dob,
  phone,
  id,
  address,
  aadharNo,
  bloodGroup,
  chronicDisease,
  allergies,
}: any) => {
  // Generate initials
  const initials = name
    ? name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
    : "?";

  // Convert stringified arrays (like '["Fever"]') into readable text
  const parseArrayField = (field: any) => {
    try {
      const parsed = JSON.parse(field);
      if (Array.isArray(parsed)) return parsed.join(", ");
      return field;
    } catch {
      return field;
    }
  };

  const chronicText = parseArrayField(chronicDisease);
  const allergyText = parseArrayField(allergies);

  // InfoRow component
  const InfoRow = ({
    icon: Icon,
    label,
    value,
  }: {
    icon: any;
    label?: string;
    value: string | null | undefined;
  }) => (
    <Group gap="xs" wrap="nowrap" className="flex-1">
      <Icon size={16} stroke={1.5} className="text-gray-500" />
      <Stack gap={0}>
        {label && <Text size="xs" c="dimmed">{label}</Text>}
        <Text size="sm" lineClamp={1}>
          {value || "N/A"}
        </Text>
      </Stack>
    </Group>
  );

  return (
<div className="!max-w-3xl !flex !gap-10 mx-auto">
  <Card
    shadow="md"
    padding="lg"
    radius="lg"
    withBorder
    className="h-full bg-white transition-shadow hover:shadow-lg duration-200 w-full"
  >
      {/* Header */}
      <div className="border-b border-gray-200 pb-3 mb-4">
        <Group align="center" wrap="nowrap">
          <Avatar radius="xl" size="lg" color="cyan" variant="filled">
            {initials}
          </Avatar>
          <Stack gap={0}>
            <Text fw={700} size="xl" lineClamp={1}>
              {name}
            </Text>
            <Text size="sm" c="dimmed">
              Patient ID: PAT0{id}
            </Text>
          </Stack>      
        </Group>
      </div>

      <Stack gap="md">
        {/* CONTACT INFORMATION */}
        <Box className="bg-blue-50 p-3 rounded-md">
          <Text size="sm" fw={600} c="blue.7" mb="sm">
            CONTACT INFORMATION
          </Text>
          <Grid gutter="md">
            <Grid.Col span={{ base: 12,  }}>
              <InfoRow icon={IconMail} label="Email" value={email} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <InfoRow icon={IconPhone} label="Phone" value={phone} />
            </Grid.Col>
            <Grid.Col span={12}>
              <InfoRow icon={IconMapPin} label="Address" value={address} />
            </Grid.Col>
          </Grid>
        </Box>

        {/* PERSONAL DETAILS */}
        <Box className="bg-blue-50 p-3 rounded-md">
            <Text size="sm" fw={600} c="blue.7" mb="sm">
                PERSONAL DETAILS
            </Text>
            <Grid gutter="md">
                <Grid.Col span={12}>
                    <InfoRow icon={IconCalendar} label="Date of Birth" value={dob ? formatDateAppShort(dob) : "N/A"} />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6 }}>
                    <InfoRow icon={IconId} label="Aadhar No" value={aadharNo} />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6 }}>
                    <InfoRow icon={IconDroplet} label="Blood Group" value={bloodGroupMap[bloodGroup]} />
                </Grid.Col>
            </Grid>
        </Box>

        {/* MEDICAL INFORMATION */}
        {(chronicText || allergyText) && (
          <Box className="bg-blue-50 p-3 rounded-md">
            <Text size="sm" fw={600} c="blue.7" mb="sm">  
              MEDICAL INFORMATION
            </Text>
            <Stack gap="xs">
              {chronicText && (
                <Group gap="xs" wrap="nowrap">
                  <IconHeartbeat size={16} stroke={1.5} className="text-gray-500" />
                  <Badge color="red" radius="sm" size="lg" variant="light">
                    {chronicText}
                  </Badge>
                </Group>
              )}
              {allergyText && (
                <Group gap="xs" wrap="nowrap">
                  <IconAlignLeft size={16} stroke={1.5} className="text-gray-500" />
                  <Badge color="orange" radius="sm" size="lg" variant="light">
                    {allergyText}
                  </Badge>
                </Group>
              )}
            </Stack>
          </Box>
        )}
      </Stack>
    </Card>
    </div>
  );
};

export default PatientCard;
