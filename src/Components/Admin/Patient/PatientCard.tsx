import { Avatar, Card, Text, Group, Badge, Divider, SimpleGrid,  ActionIcon, Tooltip } from "@mantine/core";
import {
  IconMail,
  IconPhone,
  IconMapPin,
  IconId,
  IconDroplet,
  
  IconCopy,
  IconCalendar
} from "@tabler/icons-react";
import {  formatDateDDMMYYYY } from "../../../util/DateFormat";
import { bloodGroupMap } from "../../../util/Helper";
import useProtectedImage from "../../Utilities/hook/useProtectedImage";
import { notifications } from "@mantine/notifications";

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
  profilePictureId // ✅ Added prop
}: any) => {
  
  // 1. Fetch Profile Image
  const imageUrl = useProtectedImage(profilePictureId);

  // 2. Helper to parse JSON array strings
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

  // 3. Initials
  const initials = name
    ? name.split(" ").map((n: string) => n[0]).join("").toUpperCase()
    : "?";

  // 4. Copy to clipboard
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    notifications.show({ title: 'Copied', message: `${label} copied`, color: 'teal' });
  };

  // 5. Reusable Info Item
  const InfoItem = ({ icon: Icon, value, label, copyable = false }: any) => (
    <div className="flex items-start gap-3 group">
      <div className="mt-1 p-1.5 rounded-md bg-gray-50 dark:bg-gray-700 text-violet-500 dark:text-violet-400 group-hover:bg-violet-50 dark:group-hover:bg-violet-900/30 transition-colors">
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
      {/* HEADER BANNER */}
      <div className="h-24 w-full bg-gradient-to-r from-violet-500 to-fuchsia-500 dark:from-violet-900 dark:to-fuchsia-900 relative">
         <div className="absolute inset-0 bg-white/10 pattern-dots" /> 
         <Badge 
            className="absolute top-3 right-3 bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm" 
            variant="light" 
            color="dark"
            size="sm"
         >
            ID: PAT{id}
         </Badge>
      </div>

      {/* PROFILE SECTION */}
      <div className="px-5 relative flex flex-col items-center -mt-12 text-center">
        <Avatar 
            size={80} 
            radius="100%" 
            src={imageUrl} 
            alt={name}
            className="border-[4px] border-white dark:border-gray-800 shadow-md bg-white dark:bg-gray-700 text-xl font-bold text-violet-600"
            color="initials"
        >
            {initials}
        </Avatar>
        
        <div className="mt-3 w-full">
            <Text size="lg" fw={700} className="text-gray-900 dark:text-white leading-tight">
                {name}
            </Text>
            
            {/* Blood Group Badge */}
            <Group justify="center" mt={6}>
                 <Badge 
                    leftSection={<IconDroplet size={12} className="mt-0.5"/>}
                    color="red" 
                    variant="light" 
                    size="md"
                    className="normal-case font-bold"
                 >
                    Blood Group: {bloodGroupMap[bloodGroup] || "N/A"}
                 </Badge>
            </Group>
        </div>
      </div>

      <Divider my="md" className="border-gray-100 dark:border-gray-700" />

      {/* DETAILS GRID */}
      <div className="px-5 pb-5 flex-1 space-y-4">
        <SimpleGrid cols={1} spacing="md">
            <InfoItem icon={IconMail} label="Email" value={email} copyable />
            <InfoItem icon={IconPhone} label="Phone" value={phone} copyable />
            <div className="grid grid-cols-2 gap-2">
                <InfoItem icon={IconCalendar} label="DOB" value={dob ? formatDateDDMMYYYY(dob) : null} />
                <InfoItem icon={IconId} label="Aadhar" value={aadharNo} />
            </div>
            <InfoItem icon={IconMapPin} label="Location" value={address} />
        </SimpleGrid>

        {/* MEDICAL ALERTS SECTION */}
        {(chronicText || allergyText) && (
            <div className="mt-4 pt-3 border-t border-dashed border-gray-200 dark:border-gray-700">
                <Text size="xs" c="dimmed" fw={700} mb="xs">MEDICAL ALERTS</Text>
                <div className="flex flex-wrap gap-2">
                    {chronicText && (
                        <Tooltip label="Chronic Disease">
                            <Badge color="red" variant="dot" size="sm" className="normal-case">
                                {chronicText}
                            </Badge>
                        </Tooltip>
                    )}
                    {allergyText && (
                        <Tooltip label="Allergies">
                             <Badge color="orange" variant="dot" size="sm" className="normal-case">
                                {allergyText}
                            </Badge>
                        </Tooltip>
                    )}
                </div>
            </div>
        )}
      </div>

      {/* FOOTER ACTION */}
   
    </Card>
  );
};

export default PatientCard;