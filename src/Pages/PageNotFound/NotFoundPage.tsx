import { Button, Container, Text, Title } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { IconArrowLeft } from "@tabler/icons-react";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <Container className="text-center">
        <Title order={1} className="text-[100px] font-extrabold text-blue-600">
          404
        </Title>
        <Title order={3} className="text-gray-800 mt-2">
          Page Not Found
        </Title>
        <Text size="sm" color="dimmed" className="mt-2">
          The page you’re looking for doesn’t exist or might have been moved.
        </Text>

        <div className="mt-6 flex justify-center">
          <Button
            leftSection={<IconArrowLeft size={18} />}
            color="blue"
            variant="filled"
            radius="md"
            onClick={() => navigate(-1)} 
          >
            Go Back
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default NotFoundPage;
