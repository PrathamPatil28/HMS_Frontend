import { Button, PasswordInput, SegmentedControl, TextInput, PinInput, Text, Group } from "@mantine/core"
import { IconHeartbeat } from "@tabler/icons-react"
import { useForm } from '@mantine/form';
import { Link, useNavigate } from "react-router-dom";
import { registerUserOtp, verifyRegisterOtp } from "../Service/UserService";
import { errorNotification, successNotification } from "../util/NotificationUtil";
import { useState } from "react";

const RegisterPage = () => {
    const navigate = useNavigate();
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);

    const form = useForm({
        initialValues: {
            name: "",
            role: "PATIENT",
            email: '',
            password: '',
            confirmPassword: ''
        },
        validate: {
            name: (value) => (!value ? "Name is required" : null),
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
            password: (value) =>
                !value
                    ? "Password is required"
                    : !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/.test(value)
                        ? "Password must be at least 8 characters, include uppercase, lowercase, number, and special character"
                        : null,
            confirmPassword: (value: any, values: any) => (value === values.password ? null : "Password don't match"),
        },
    });

    // Step 1: Send OTP
    const handleSendOtp = (values: typeof form.values) => {
        setLoading(true);
        registerUserOtp(values)
            .then(() => {
                successNotification("OTP Sent to Email");
                setOtpSent(true);
            })
            .catch((error) => {
                console.error(error);
                errorNotification(error.response?.data?.errorMessage || "Failed to send OTP");
            })
            .finally(() => setLoading(false));
    };

    // Step 2: Verify OTP
    const handleVerifyOtp = () => {
        if (otp.length !== 6) {
            errorNotification("Please enter 6 digit OTP");
            return;
        }
        setLoading(true);
        verifyRegisterOtp(form.values.email, otp)
            .then(() => {
                successNotification("Registration Successful! Please Login.");
                navigate('/login');
            })
            .catch((error) => {
                console.error(error);
                errorNotification(error.response?.data?.errorMessage || "Invalid OTP");
            })
            .finally(() => setLoading(false));
    };

    return (
        <div style={{ background: 'url("/bg.jpg")' }} className="h-screen w-screen !bg-cover !bg-center !bg-no-repeat flex flex-col items-center justify-center">
            <div className="py-3 text-pink-500 flex gap-1 items-center">
                <IconHeartbeat size={40} stroke={2.5} />
                <span className="font-heading font-semibold text-4xl">Pulse</span>
            </div>

            <div className="w-[450px] backdrop-blur-md p-10 py-8 rounded-lg shadow-2xl border border-white/20">
                
                {!otpSent ? (
                    <form onSubmit={form.onSubmit(handleSendOtp)} className="flex flex-col gap-5">
                        <div className="self-center font-heading font-medium text-white text-xl">Create Account</div>

                        {/* UPDATED: Added LAB_TECHNICIAN to roles */}
                        <SegmentedControl
                            {...form.getInputProps("role")}
                            color="pink" bg={"none"}
                            className="border border-white text-white"
                            fullWidth size="xs" radius="md"
                            data={[
                                { label: 'Patient', value: "PATIENT" }, 
                                { label: 'Doctor', value: "DOCTOR" }, 
                                { label: 'Driver', value: "DRIVER" },
                                { label: 'Technician', value: "LAB_TECHNICIAN" } 
                            ]} 
                        />

                        <TextInput
                            {...form.getInputProps('name')}
                            variant="filled" radius="md"
                            placeholder="Full Name"
                        />

                        <TextInput
                            {...form.getInputProps('email')}
                            variant="filled" radius="md"
                            placeholder="Email Address"
                        />

                        <PasswordInput
                            {...form.getInputProps('password')}
                            variant="filled" radius="md"
                            placeholder="Password"
                        />

                        <PasswordInput
                            {...form.getInputProps('confirmPassword')}
                            variant="filled" radius="md"
                            placeholder="Confirm Password"
                        />

                        <Button radius="md" size="md" type="submit" color="pink" loading={loading}>
                            Sign Up
                        </Button>

                        <div className="text-neutral-100 text-sm self-center">
                            Already have an account? <Link className="hover:underline font-bold" to={"/login"}>Login</Link>
                        </div>
                    </form>
                ) : (
                    <div className="flex flex-col gap-6 items-center text-white">
                         <div className="text-center">
                            <Text size="xl" fw={700}>Verify Email</Text>
                            <Text size="sm" c="dimmed" className="text-gray-200">Enter the OTP sent to {form.values.email}</Text>
                         </div>

                         <PinInput 
                            length={6} 
                            type="number" 
                            size="md" 
                            value={otp} 
                            onChange={setOtp} 
                            className="gap-3"
                            autoFocus
                         />

                         <Group w="100%">
                             <Button variant="default" fullWidth onClick={() => setOtpSent(false)} disabled={loading}>Back</Button>
                             <Button color="pink" fullWidth onClick={handleVerifyOtp} loading={loading}>Verify & Register</Button>
                         </Group>
                    </div>
                )}

            </div>
        </div>
    )
}

export default RegisterPage;