import { Button, PasswordInput, TextInput, PinInput, Text, Group } from "@mantine/core"
import { IconHeartbeat } from "@tabler/icons-react"
import { useForm } from '@mantine/form';
import { Link, } from "react-router-dom";
import { loginUserOtp, verifyLoginOtp } from "../Service/UserService";
import { errorNotification, successNotification } from "../util/NotificationUtil";
import { useDispatch } from "react-redux";
import { setJwt } from "../Slices/JwtSlice";
import { setUser } from "../Slices/UserSlice";
import { useState } from "react";

const LoginPage = () => {
  const dispatch = useDispatch();
  // const navigate = useNavigate();
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password : (value:any)=>(!value?"Password is required":null)
    },
  });

  // Step 1: Validate Credentials & Send OTP
  const handleSendOtp = (values: typeof form.values) => {
      setLoading(true);
      loginUserOtp(values)
          .then(() => {
              successNotification("OTP Sent to Email");
              setOtpSent(true);
          })
          .catch((error) => {
              errorNotification(error?.response?.data?.errorMessage || "Invalid Credentials");
          })
          .finally(() => setLoading(false));
  };

  // Step 2: Verify OTP & Login
  const handleVerifyOtp = () => {
      if (otp.length !== 6) {
          errorNotification("Enter valid OTP");
          return;
      }
      
      setLoading(true);
      // verifyLoginOtp returns the JWT string directly on success
      verifyLoginOtp(form.values.email, otp)
        .then((token) => {
            successNotification("Login Successful");
            dispatch(setJwt(token));
            dispatch(setUser(token));
            // Navigate based on role logic usually happens in a protected route wrapper or here
            // but for now just set state
        })
        .catch((error) => {
            errorNotification(error?.response?.data?.errorMessage || "Invalid OTP");
        })
        .finally(() => setLoading(false));
  };

  return (
    <div style={{ background: 'url("/bg.jpg")' }} className="h-screen w-screen !bg-cover !bg-center !bg-no-repeat flex flex-col items-center justify-center">
       <div className="py-3 text-pink-500 flex gap-1 items-center">
        <IconHeartbeat size={40} stroke={2.5}/>
        <span className="font-heading font-semibold text-4xl">Pulse</span>
      </div>
     
      <div className="w-[450px] backdrop-blur-md p-10 py-8 rounded-lg shadow-2xl border border-white/20">
        
        {!otpSent ? (
            <form onSubmit={form.onSubmit(handleSendOtp)} className="flex flex-col gap-5">
            <div className="self-center font-heading font-medium text-white text-xl">Welcome Back</div>

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

            <Button radius="md" size="md" type="submit" color="pink" loading={loading}>
                Login with OTP
            </Button>

            <div className="text-neutral-100 text-sm self-center">
                Don't have an account? <Link className="hover:underline font-bold" to={"/register"}>Register</Link>
            </div>
            </form>
        ) : (
            <div className="flex flex-col gap-6 items-center text-white">
                 <div className="text-center">
                    <Text size="xl" fw={700}>Two-Factor Auth</Text>
                    <Text size="sm" c="dimmed" className="text-gray-200">Enter OTP sent to {form.values.email}</Text>
                 </div>

                 <PinInput 
                    length={6} 
                    type="number" 
                    size="md" 
                    value={otp} 
                    onChange={setOtp} 
                    autoFocus
                 />

                 <Group w="100%">
                   <Button color="pink" fullWidth onClick={handleVerifyOtp} loading={loading}>Verify & Login</Button>
                     <Button variant="default" fullWidth onClick={() => setOtpSent(false)} disabled={loading}>Back</Button>
                 </Group>
            </div>
        )}

      </div>
    </div>
  )
}

export default LoginPage