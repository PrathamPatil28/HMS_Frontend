import { useState, useEffect } from "react";
import { 
  TextInput, NumberInput, Select, Button, Table, Card, 
  Group, Text, Badge, LoadingOverlay, Pagination 
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconFlask, IconPlus } from "@tabler/icons-react";
import { addTestType, getAllTestTypes } from "../../../Service/LabService";
import { errorNotification, successNotification } from "../../../util/NotificationUtil";

const categories = [
  "PATHOLOGY", "RADIOLOGY", "MICROBIOLOGY", "BIOCHEMISTRY", "HEMATOLOGY"
];

const LabTestManager = () => {
  const [tests, setTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Pagination State
  const [activePage, setActivePage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  const form = useForm({
    initialValues: {
      testName: "",
      category: "PATHOLOGY",
      price: 0,
      normalRange: ""
    },
    validate: {
      testName: (val) => (val.length < 2 ? "Name is required" : null),
      price: (val) => (val <= 0 ? "Price must be positive" : null),
    }
  });

  useEffect(() => {
    fetchTests(activePage);
  }, [activePage]);

  const fetchTests = (pageNumber: number) => {
    setLoading(true);
    // Backend uses 0-based index, Mantine uses 1-based
    getAllTestTypes(pageNumber - 1, pageSize)
      .then((res: any) => {
        setTests(res.content); // ✅ Extract content from Page object
        setTotalPages(res.totalPages); // ✅ Set total pages
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleSubmit = (values: any) => {
    setLoading(true);
    addTestType(values)
      .then((res) => {
        successNotification(`Test '${res.testName}' Added Successfully!`);
        form.reset();
        fetchTests(activePage); // Refresh current page
      })
      .catch((err) => {
        errorNotification("Failed to add test. Name might be duplicate.");
        console.error(err);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="p-6">
      <Group mb="lg">
        <IconFlask size={32} className="text-blue-600" />
        <Text size="xl" fw={700}>Lab Master Data</Text>
      </Group>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* LEFT: Add New Test Form */}
        <Card withBorder shadow="sm" radius="md" className="h-fit">
          <Card.Section withBorder inheritPadding py="xs" bg="gray.0">
            <Text fw={600}>Add New Test</Text>
          </Card.Section>
          
          <form onSubmit={form.onSubmit(handleSubmit)} className="flex flex-col gap-4 mt-4">
            <LoadingOverlay visible={loading} />
            
            <TextInput 
              label="Test Name" 
              placeholder="e.g. CBC, Lipid Profile" 
              {...form.getInputProps("testName")} 
              withAsterisk 
            />
            
            <Select 
              label="Category" 
              data={categories} 
              {...form.getInputProps("category")} 
              withAsterisk 
            />
            
            <NumberInput 
              label="Price (₹)" 
              placeholder="0.00" 
              {...form.getInputProps("price")} 
              min={0} 
              withAsterisk 
            />
            
            <TextInput 
              label="Normal Range (Optional)" 
              placeholder="e.g. 12-16 g/dL" 
              {...form.getInputProps("normalRange")} 
            />
            
            <Button type="submit" mt="md" leftSection={<IconPlus size={16}/>}>
              Add Test
            </Button>
          </form>
        </Card>

        {/* RIGHT: List of Available Tests */}
        <Card withBorder shadow="sm" radius="md" className="md:col-span-2 flex flex-col justify-between">
          <div>
            <Card.Section withBorder inheritPadding py="xs" bg="gray.0">
              <Text fw={600}>Available Tests</Text>
            </Card.Section>

            <Table striped highlightOnHover mt="md">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>ID</Table.Th>
                  <Table.Th>Name</Table.Th>
                  <Table.Th>Category</Table.Th>
                  <Table.Th>Price</Table.Th>
                  <Table.Th>Range</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {tests.length === 0 ? (
                  <Table.Tr>
                    <Table.Td colSpan={5} align="center">No tests found.</Table.Td>
                  </Table.Tr>
                ) : (
                  tests.map((t) => (
                    <Table.Tr key={t.id}>
                      <Table.Td>{t.id}</Table.Td>
                      <Table.Td fw={500}>{t.testName}</Table.Td>
                      <Table.Td><Badge size="sm" variant="outline">{t.category}</Badge></Table.Td>
                      <Table.Td>₹{t.price}</Table.Td>
                      <Table.Td className="text-gray-500 text-sm">{t.normalRange || "-"}</Table.Td>
                    </Table.Tr>
                  ))
                )}
              </Table.Tbody>
            </Table>
          </div>
          
          {/* ✅ Pagination Controls */}
          <Group justify="center" mt="md">
            <Pagination 
                total={totalPages} 
                value={activePage} 
                onChange={setActivePage} 
                color="blue" 
            />
          </Group>
        </Card>
      </div>
    </div>
  );
};

export default LabTestManager;