import { useEffect, useState } from "react";
import { Table, Button, Badge } from "@mantine/core";
import { 
    getAllBloodRequests, 
    approveBloodRequest, 
    BloodRequestDTO 
} from "../../../Service/BloodBankService";
import { errorNotification, successNotification } from "../../../util/NotificationUtil";

const RequestManager = () => {
    const [requests, setRequests] = useState<BloodRequestDTO[]>([]);

    const fetchData = () => {
        getAllBloodRequests().then(setRequests).catch(console.error);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleApprove = (id: number) => {
        approveBloodRequest(id)
            .then(() => {
                successNotification("Request Approved & Stock Updated");
                fetchData();
            })
            .catch((err) => {
                const msg = err.response?.data?.message || "Approval Failed (Check Stock)";
                errorNotification(msg);
            });
    };

    const rows = requests.map((req) => (
        <Table.Tr key={req.id}>
            <Table.Td>{req.id}</Table.Td>
            <Table.Td>Patient #{req.patientId}</Table.Td>
            <Table.Td>
                <span className="font-bold text-red-600">{req.requestedGroup}</span>
            </Table.Td>
            <Table.Td>{req.unitsRequired} Units</Table.Td>
            <Table.Td>
                <Badge 
                    color={
                        req.status === "PENDING" ? "orange" : 
                        req.status === "APPROVED" ? "green" : "red"
                    }
                >
                    {req.status}
                </Badge>
            </Table.Td>
            <Table.Td>
                {req.status === "PENDING" && (
                    <Button 
                        size="xs" 
                        color="green" 
                        onClick={() => handleApprove(req.id!)}
                    >
                        Approve
                    </Button>
                )}
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <div className="bg-white p-5 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-neutral-700 mb-4">Blood Requests</h2>
            <Table striped highlightOnHover withTableBorder>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Req ID</Table.Th>
                        <Table.Th>Patient</Table.Th>
                        <Table.Th>Group</Table.Th>
                        <Table.Th>Quantity</Table.Th>
                        <Table.Th>Status</Table.Th>
                        <Table.Th>Action</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
            </Table>
        </div>
    );
};

export default RequestManager;