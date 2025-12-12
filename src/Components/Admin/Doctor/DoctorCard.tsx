import { Avatar, Card, Text, Group,  Badge,  Divider, SimpleGrid,  ActionIcon } from "@mantine/core";
import {
  IconMail,
  IconPhone,
  IconMapPin,
  IconCertificate,
  IconBriefcase,
  IconBuildingHospital,

  IconCopy
} from "@tabler/icons-react";
import { formatDateDDMMYYYY } from "../../../util/DateFormat";
import { notifications } from "@mantine/notifications";
import useProtectedImage from "../../Utilities/hook/useProtectedImage"; // ✅ 1. Import Hook

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
  profilePictureId // ✅ 2. Get ID from props
}: any) => {
  
  // ✅ 3. Fetch Image URL using the hook
  const imageUrl = useProtectedImage(profilePictureId);

  // Generate Initials
  const initials = name
    ? name.split(" ").map((n: string) => n[0]).join("").toUpperCase()
    : "?";

  // Helper for Copying Text
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    notifications.show({
        title: 'Copied',
        message: `${label} copied to clipboard`,
        color: 'blue',
        position: 'bottom-center'
    });
  };

  const InfoItem = ({ icon: Icon, value, label, copyable = false }: any) => (
    <div className="flex items-start gap-3 group">
      <div className="mt-1 p-1.5 rounded-md bg-gray-50 dark:bg-gray-700 text-primary-500 dark:text-primary-400 group-hover:bg-primary-50 dark:group-hover:bg-primary-900/30 transition-colors">
        <Icon size={16} stroke={1.5} />
      </div>
      <div className="flex-1 overflow-hidden">
        <Text size="xs" c="dimmed" fw={600} tt="uppercase" className="mb-0.5">
          {label}
        </Text>
        <Group gap={4} wrap="nowrap">
            <Text size="sm" fw={500} truncate className="dark:text-gray-200">
            {value || "N/A"}
            </Text>
            {copyable && value && (
                <ActionIcon 
                    variant="subtle" color="gray" size="xs" 
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => { e.stopPropagation(); copyToClipboard(value, label); }}
                >
                    <IconCopy size={10} />
                </ActionIcon>
            )}
        </Group>
      </div>
    </div>
  );

  return (
    <Card
      padding="0"
      radius="lg"
      withBorder
      className="group relative flex flex-col h-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden"
    >
      {/* 1. DECORATIVE HEADER BANNER */}
      <div className="h-24 w-full bg-gradient-to-r from-blue-500 to-cyan-400 dark:from-blue-900 dark:to-cyan-900 relative">
         <div className="absolute inset-0 bg-white/10 pattern-dots" /> 
         <Badge 
            className="absolute top-3 right-3 bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm" 
            variant="light" 
            color="dark"
            size="sm"
         >
            ID: {id}
         </Badge>
      </div>

      {/* 2. PROFILE SECTION (Overlapping) */}
      <div className="px-5 relative flex flex-col items-center -mt-12 text-center">
        <Avatar 
            size={80} 
            radius="100%" 
            src={imageUrl} // ✅ 4. Pass generated URL here
            alt={name}
            className="border-[4px] border-white dark:border-gray-800 shadow-md bg-white dark:bg-gray-700 text-xl font-bold text-primary-600"
            color="initials"
        >
            {initials}
        </Avatar>
        
        <div className="mt-3 w-full">
            <Text size="lg" fw={700} className="text-gray-900 dark:text-white leading-tight">
                {name}
            </Text>
            <Text size="sm" c="dimmed" className="mb-3">
                {specialization || "General Physician"}
            </Text>

            <Group justify="center" gap={8} mt={4}>
                <Badge 
                    leftSection={<IconBuildingHospital size={14} style={{ marginTop: 1 }} />} 
                    variant="light" 
                    color="blue" 
                    size="md"
                    radius="sm"
                    className="normal-case font-semibold"
                >
                    {department || "General"}
                </Badge>

                <Badge 
                    leftSection={<IconBriefcase size={14} style={{ marginTop: 1 }} />} 
                    variant="light" 
                    color="teal" 
                    size="md" 
                    radius="sm"
                    className="normal-case font-semibold"
                >
                    {totalExp ? `${totalExp} Years Exp.` : "Fresher"}
                </Badge>
            </Group>
        </div>
      </div>

      <Divider my="md" className="border-gray-100 dark:border-gray-700" />

      {/* 3. DETAILS GRID */}
      <div className="px-5 pb-5 flex-1">
        <SimpleGrid cols={1} spacing="md">
            <InfoItem icon={IconMail} label="Email Address" value={email} copyable />
            <InfoItem icon={IconPhone} label="Phone Number" value={phone} copyable />
            
            <div className="grid grid-cols-2 gap-2">
                <InfoItem icon={IconCertificate} label="Licence" value={licenceNo} />
                <InfoItem icon={IconBriefcase} label="DOB" value={dob ? formatDateDDMMYYYY(dob) : null} />
            </div>

            <InfoItem icon={IconMapPin} label="Location" value={address} />
        </SimpleGrid>
      </div>

    
    </Card>
  );
};

export default DoctorCard;