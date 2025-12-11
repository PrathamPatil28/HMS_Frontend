import { useEffect, useState } from "react";
import { Table, Button, Badge, Card, Text, Loader, Center, ActionIcon, Group, Tooltip } from "@mantine/core";
import { useSelector } from "react-redux";
import { IconReceipt,  IconDownload } from "@tabler/icons-react";
import { getMyBills, createPaymentOrder, verifyPayment, PatientBillDTO, getPaymentDetails } from "../../../Service/BillingService";
import { successNotification, errorNotification } from "../../../util/NotificationUtil";
import { formatDateAppShort } from "../../../util/DateFormat";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Declare Razorpay on window
declare global {
    interface Window {
        Razorpay: any;
    }
}

const MyBills = () => {
    const user = useSelector((state: any) => state.user);
    const [bills, setBills] = useState<PatientBillDTO[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchBills = () => {
        if (user?.profileId) {
            setLoading(true);
            getMyBills(user.profileId)
                .then(setBills)
                .catch(console.error)
                .finally(() => setLoading(false));
        }
    };

    useEffect(() => {
        fetchBills();
        // Load Razorpay Script
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);
    }, [user]);

    const handlePayment = async (bill: PatientBillDTO) => {
        try {
            // 1. Create Order
            const orderData = await createPaymentOrder(bill.id, bill.totalAmount);
            const { razorpayOrderId, amount } = orderData;

            // 2. Open Razorpay
            const options = {
                key: "rzp_test_A2Ll2p3XgSjrAV", // Replace with your Test Key ID
                amount: amount * 100,
                currency: "INR",
                name: "Pulse HMS",
                description: `Bill Payment #${bill.id}`,
                order_id: razorpayOrderId,
                handler: async function (response: any) {
                    // 3. Verify Payment
                    const verifyPayload = {
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature
                    };
                    
                    await verifyPayment(verifyPayload);
                    successNotification("Payment Successful!");
                    fetchBills(); // Refresh list to show PAID
                },
                prefill: {
                    name: user.name,
                    email: user.email,
                    contact: "9999999999" 
                },
                theme: {
                    color: "#3399cc"
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (error) {
            errorNotification("Payment Initialization Failed");
            console.error(error);
        }
    };

const downloadPDF = async (bill: PatientBillDTO) => {
        const doc = new jsPDF();

        // Data Variables
        let paymentId = "N/A";
        let orderId = "N/A";
        let paymentDate = "N/A";

        // 1. Fetch Real Payment Data
        if (bill.status === "PAID") {
            try {
                // ✅ Fetch data
                const paymentData = await getPaymentDetails(bill.id);
                console.log("PDF Payment Data:", paymentData); // Debug Log

                if (paymentData) {
                    paymentId = paymentData.razorpayPaymentId || "N/A";
                    orderId = paymentData.razorpayOrderId || "N/A";
                    
                    // ✅ Handle Date Safely
                    if (paymentData.transactionDate) {
                        // Ensure your formatDateAppShort handles ISO strings
                        paymentDate = formatDateAppShort(paymentData.transactionDate);
                    }
                }
            } catch (error) {
                // 🛑 If this logs in Console, it means the API call failed (404/500)
                console.error("Failed to load payment details for PDF:", error);
            }
        }

        // --- COLORS & FONTS ---
        const primaryColor = [33, 150, 243] as [number, number, number]; // Blue
        const greyColor = [100, 100, 100] as [number, number, number];
        const lightGrey = [245, 245, 245] as [number, number, number];

        // --- HEADER ---
        // Blue Banner
        doc.setFillColor(...primaryColor);
        doc.rect(0, 0, 210, 40, "F");

        // Company Name
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont("helvetica", "bold");
        doc.text("PULSE HOSPITAL", 14, 18);
        
        // Company Details
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text("123 Health Street, Mumbai, India", 14, 25);
        doc.text("contact@pulse-hms.com | +91 98765 43210", 14, 30);

        // Invoice Label
        doc.setFontSize(26);
        doc.text("INVOICE", 196, 25, { align: "right" });

        // --- INFO SECTION ---
        doc.setTextColor(0, 0, 0);
        const startY = 55;

        // Left: Bill To
        doc.setFontSize(10);
        doc.setTextColor(...greyColor);
        doc.text("BILL TO:", 14, startY);
        
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text(user.name.toUpperCase(), 14, startY + 6);
        
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...greyColor);
        doc.text(user.email, 14, startY + 12);
        
        // Right: Invoice Details
        const labelX = 120;
        const valueX = 196;
        
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        
        // Invoice No
        doc.setFont("helvetica", "bold");
        doc.text("Invoice No:", labelX, startY);
        doc.setFont("helvetica", "normal");
        doc.text(`#${bill.id}`, valueX, startY, { align: "right" });
        
        // Date
        doc.setFont("helvetica", "bold");
        doc.text("Date:", labelX, startY + 6);
        doc.setFont("helvetica", "normal");
        doc.text(formatDateAppShort(bill.billDate), valueX, startY + 6, { align: "right" });

        // Status
        doc.setFont("helvetica", "bold");
        doc.text("Status:", labelX, startY + 12);
        if (bill.status === "PAID") {
            doc.setTextColor(39, 174, 96); // Green
        } else {
            doc.setTextColor(231, 76, 60); // Red
        }
        doc.setFont("helvetica", "bold");
        doc.text(bill.status, valueX, startY + 12, { align: "right" });
        doc.setTextColor(0, 0, 0); // Reset

        // --- TABLE ---
        const tableData = bill.items.map((item) => [
            item.sourceService.replace("_MS", "").replace("_", " "), 
            item.description,
            `Rs. ${item.amount.toFixed(2)}`
        ]);

        autoTable(doc, {
            startY: startY + 25,
            head: [['SERVICE', 'DESCRIPTION', 'AMOUNT']],
            body: tableData,
            theme: 'plain',
            headStyles: { 
                fillColor: primaryColor, 
                textColor: 255, 
                fontStyle: 'bold',
                halign: 'left',
                cellPadding: 8
            },
            styles: { 
                fontSize: 10, 
                cellPadding: 8,
                textColor: [50, 50, 50],
                lineColor: [230, 230, 230],
                lineWidth: 0.1
            },
            columnStyles: {
                0: { fontStyle: 'bold', cellWidth: 40 },
                2: { halign: 'right', cellWidth: 40, fontStyle: 'bold' }
            },
            alternateRowStyles: { fillColor: lightGrey }
        });

        // --- SUMMARY & PAYMENT DETAILS ---
        const finalY = (doc as any).lastAutoTable.finalY + 15;

        // 1. Payment Details Box (Left Side)
        if (bill.status === "PAID") {
            doc.setDrawColor(220, 220, 220);
            doc.setFillColor(250, 250, 250);
            doc.roundedRect(14, finalY, 110, 45, 2, 2, "FD");

            doc.setFontSize(10);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(0, 0, 0);
            doc.text("Payment Information", 20, finalY + 8);

            doc.setFontSize(9);
            doc.setFont("helvetica", "normal");
            
            const labelX_Payment = 20;
            const valueX_Payment = 55;
            let currentY = finalY + 16;
            const gap = 6;

            doc.setTextColor(...greyColor);
            doc.text("Order ID:", labelX_Payment, currentY);
            doc.setTextColor(0, 0, 0);
            doc.text(orderId, valueX_Payment, currentY);

            currentY += gap;
            doc.setTextColor(...greyColor);
            doc.text("Txn ID:", labelX_Payment, currentY);
            doc.setTextColor(0, 0, 0);
            doc.text(paymentId, valueX_Payment, currentY);

            currentY += gap;
            doc.setTextColor(...greyColor);
            doc.text("Paid On:", labelX_Payment, currentY);
            doc.setTextColor(0, 0, 0);
            doc.text(paymentDate, valueX_Payment, currentY);
        }

        // 2. Totals
        const rightLabelX = 140;
        const rightValueX = 196;
        
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Grand Total:", rightLabelX, finalY + 8);
        
        doc.setFontSize(16);
        doc.setTextColor(...primaryColor);
        doc.text(`Rs. ${bill.totalAmount.toFixed(2)}`, rightValueX, finalY + 8, { align: "right" });
        doc.setTextColor(0, 0, 0);

        // Footer
        const pageHeight = doc.internal.pageSize.height;
        doc.setDrawColor(220, 220, 220);
        doc.line(14, pageHeight - 25, 196, pageHeight - 25);

        doc.setFontSize(9);
        doc.setTextColor(150, 150, 150);
        doc.setFont("helvetica", "italic");
        doc.text("Thank you for choosing Pulse Hospital.", 105, pageHeight - 18, { align: "center" });
        doc.text("This is a computer-generated invoice.", 105, pageHeight - 12, { align: "center" });

        doc.save(`Pulse_Invoice_${bill.id}.pdf`);
    };

    return (
        <div className="p-5">
            <h1 className="text-2xl font-heading font-bold text-primary-500 mb-6">My Invoices</h1>

            <Card padding="lg" radius="md" withBorder>
                {loading ? (
                    <Center h={100}><Loader /></Center>
                ) : bills.length > 0 ? (
                    <Table striped highlightOnHover withTableBorder>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Bill ID</Table.Th>
                                <Table.Th>Date</Table.Th>
                                <Table.Th>Service Breakdown</Table.Th> {/* Updated Column */}
                                <Table.Th>Total</Table.Th>
                                <Table.Th>Status</Table.Th>
                                <Table.Th>Action</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {bills.map(bill => (
                                <Table.Tr key={bill.id}>
                                    <Table.Td>#{bill.id}</Table.Td>
                                    <Table.Td>{formatDateAppShort(bill.billDate)}</Table.Td>
                                    
                                    {/* Service Breakdown Column (Merged Type + Description + Amount) */}
                                    <Table.Td>
                                        <div className="flex flex-col gap-2">
                                            {bill.items.map(item => (
                                                <div key={item.id} className="flex items-center gap-2 border-b border-gray-100 last:border-0 pb-1 text-sm">
                                                    <Badge 
                                                        size="xs" 
                                                        variant="outline" 
                                                        color="blue"
                                                        className="min-w-fit"
                                                    >
                                                        {item.sourceService.replace("_MS", "")}
                                                    </Badge>
                                                    <span className="text-gray-700 truncate flex-1" title={item.description}>
                                                        {item.description}
                                                    </span>
                                                    <span className="font-semibold text-gray-900 whitespace-nowrap">
                                                        ₹{item.amount}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </Table.Td>
                                    
                                    <Table.Td fw={700}>₹{bill.totalAmount}</Table.Td>
                                    <Table.Td>
                                        <Badge color={bill.status === "PAID" ? "green" : "orange"}>
                                            {bill.status}
                                        </Badge>
                                    </Table.Td>
                                    
                                    <Table.Td>
                                        <Group gap={5}>
                                            {bill.status === "PENDING" ? (
                                                <Button 
                                                    size="xs" 
                                                    color="blue" 
                                                    onClick={() => handlePayment(bill)}
                                                    leftSection={<IconReceipt size={14}/>}
                                                >
                                                    Pay
                                                </Button>
                                            ) : (
                                                <Tooltip label="Download Invoice">
                                                    <ActionIcon 
                                                        variant="light" 
                                                        color="teal" 
                                                        onClick={() => downloadPDF(bill)}
                                                    >
                                                        <IconDownload size={18} />
                                                    </ActionIcon>
                                                </Tooltip>
                                            )}
                                        </Group>
                                    </Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                ) : (
                    <Text ta="center" c="dimmed" py="xl">No invoices found.</Text>
                )}
            </Card>
        </div>
    );
};

export default MyBills;