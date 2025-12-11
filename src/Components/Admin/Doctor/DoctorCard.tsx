import { Avatar, Card, Text, Group, Stack, Grid, Box, Badge } from "@mantine/core";
import {
  IconMail,
  IconPhone,
  IconCalendar,
  IconMapPin,
  IconCertificate,
  IconStethoscope,
  IconBuildingHospital,
  IconAward,
} from "@tabler/icons-react";
import { formatDateAppShort } from "../../../util/DateFormat";

const DoctorCard = ({
  name,
  email,
  dob,
  phone,
  id,
  address,
  licenceNo,
  specialization,
  department,
  totalExp,
}: any) => {
  const initials = name
    ? name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
    : "?";

  const InfoRow = ({
    icon: Icon,
    label,
    value,
  }: {
    icon: any;
    label?: string;
    value: string | number | null | undefined;
  }) => (
    <Group gap="xs" wrap="nowrap" className="flex-1">
      <Icon size={16} stroke={1.5} className="text-gray-500" />
      <Stack gap={0}>
        {label && (
          <Text size="xs" c="dimmed">
            {label}
          </Text>
        )}
        <Text size="sm" lineClamp={1}>
          {value || "N/A"}
        </Text>
      </Stack>
    </Group>
  );

  return (
    <Card
      shadow="md"
      padding="lg"
      radius="lg"
      withBorder
    className="h-full bg-white !transition-all !duration-300 !ease-in-out hover:!shadow-lg hover:!bg-primary-200 cursor-pointer w-full"

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
              Doctor ID: DOC0{id}
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
            <Grid.Col span={{ base: 12 }}>
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
              <InfoRow
                icon={IconCalendar}
                label="Date of Birth"
                value={dob ? formatDateAppShort(dob) : "N/A"}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <InfoRow icon={IconCertificate} label="Licence No" value={licenceNo} />
            </Grid.Col>
          </Grid>
        </Box>

        {/* PROFESSIONAL INFORMATION */}
        <Box className="bg-blue-50 p-3 rounded-md">
          <Text size="sm" fw={600} c="blue.7" mb="sm">
            PROFESSIONAL INFORMATION
          </Text>
          <Stack gap="xs">
            <div className="flex  gap-3">
            <Group gap="xs" wrap="nowrap">
              <IconStethoscope size={16} stroke={1.5} className="text-gray-500" />
              <Stack gap={0}>
                <Text size="xs" c="dimmed">
                  Specialization
                </Text>
                <Badge color="cyan" radius="sm" size="lg" variant="light">
                  {specialization || "N/A"}
                </Badge>
              </Stack>
            </Group>

            <Group gap="xs" wrap="nowrap">
              <IconBuildingHospital size={16} stroke={1.5} className="text-gray-500" />
              <Stack gap={0}>
                <Text size="xs" c="dimmed">
                  Department
                </Text>
                <Badge color="blue" radius="sm" size="lg" variant="light">
                  {department || "N/A"}
                </Badge>
              </Stack>
            </Group>

                 </div>

            <Group gap="xs" wrap="nowrap">
              <IconAward size={16} stroke={1.5} className="text-gray-500" />
              <Stack gap={0}>
                <Text size="xs" c="dimmed">
                  Experience
                </Text>
                <Badge color="green" radius="sm" size="lg" variant="light">
                  {totalExp ? `${totalExp} yrs` : "N/A"}
                </Badge>
              </Stack>
            </Group>
          </Stack>
        </Box>
      </Stack>
    </Card>
  );
};

export default DoctorCard;
