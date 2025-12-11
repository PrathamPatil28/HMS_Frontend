import {
  Container,
  Title,
  Text,
  Button,
  Grid,
  ThemeIcon,
  Image,
  Group,
  Stack,
  Badge,
  SimpleGrid,
  TextInput,
  Textarea,
  ActionIcon
} from '@mantine/core';

import {
  IconAmbulance,
  IconDroplet,
  IconPill,
  IconCheck,
  IconPhone,
  IconReceipt2,
  IconHeartRateMonitor,
  IconMapPin,
  IconMail,
  IconBrandLinkedin,
  IconBriefcase,
  IconStar,
  IconStethoscope,
  IconBrandX,
  IconArrowRight,
  IconBolt
} from '@tabler/icons-react';

import { useNavigate } from 'react-router-dom';
import PublicNavbar from '../Components/Headers/PublicNavbar';
import PublicFooter from '../Components/Headers/PublicFooter';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-[#020617] min-h-screen flex flex-col font-sans selection:bg-teal-100 selection:text-teal-900 dark:selection:bg-teal-900 dark:selection:text-teal-100 transition-colors duration-500">
      <PublicNavbar />

      {/* ==========================================
          1. HERO SECTION 
      ========================================== */}
      <div className="relative bg-white dark:bg-[#020617] pt-32 pb-15 overflow-hidden transition-colors duration-500">
        {/* GRID BACKDROP */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] dark:opacity-10"></div>

        {/* SOFT GRADIENT LIGHT */}
        <div className="absolute top-20 left-1/3 w-[600px] h-[600px] bg-teal-300/20 dark:bg-teal-500/10 blur-[120px] rounded-full"></div>

        <Container size="xl" className="relative z-10">
          <Grid gutter={120} align="center">

            {/* TEXT SIDE */}
            <Grid.Col span={{ base: 12, md: 6, lg: 7 }}>

              {/* AI Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-900/30 dark:to-blue-900/30 border border-teal-100 dark:border-teal-800 shadow-sm mb-8 cursor-default transition-colors">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-500 dark:bg-teal-400"></span>
                </span>
                <span className="text-sm font-semibold text-teal-800 dark:text-teal-300 tracking-wide">
                  v2.0: AI-Powered Diagnostics
                </span>
              </div>

              {/* TITLE */}
              <Title className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white leading-[1.1] mb-8 tracking-tight">
                Healthcare
                Management, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 via-blue-600 to-indigo-600 dark:from-teal-400 dark:via-blue-400 dark:to-indigo-400">
                  Reimagined.
                </span>
              </Title>

              {/* DESCRIPTION */}
              <Text className="text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed max-w-xl font-medium">
                Streamline appointments, billing, and patient records with Pulse — the
                AI-powered operating system designed for modern hospitals.
              </Text>

              {/* CTA BUTTONS */}
              <Group gap="md" className="mb-14">
                <Button
                  size="xl"
                  radius="md"
                  className="bg-slate-900 dark:bg-white mt-5 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 shadow-xl px-10 h-14 text-lg transition-all"
                  onClick={() => navigate('/register')}
                >
                  Get Started Free
                </Button>

                <Button
                  size="xl"
                  variant="outline"
                  radius="md"
                  leftSection={<IconPhone size={20} />}
                  className="h-14 px-8 mt-5 text-lg font-semibold border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                >
                  Book Demo
                </Button>
              </Group>

              {/* ⭐ QUICK FEATURES */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-12">
                <div className="flex items-center gap-3">
                  <IconCheck size={20} className="text-teal-600 dark:text-teal-400" />
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Fast onboarding</p>
                </div>
                <div className="flex items-center gap-3">
                  <IconHeartRateMonitor size={20} className="text-blue-600 dark:text-blue-400" />
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Real-time vitals</p>
                </div>
                <div className="flex items-center gap-3">
                  <IconReceipt2 size={20} className="text-indigo-600 dark:text-indigo-400" />
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Smart billing</p>
                </div>
              </div>

              {/* TRUST BADGES */}
              <div className="flex flex-wrap items-center gap-6 pb-10 border-b border-slate-200 dark:border-slate-800 mb-12">
                <Badge size="lg" radius="md" className="bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 font-semibold">
                  ✔ HIPAA Compliant
                </Badge>
                <Badge size="lg" radius="md" className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-semibold">
                  ✔ ISO 27001 Certified
                </Badge>
                <Badge size="lg" radius="md" className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-semibold">
                  ✔ Encrypted Cloud
                </Badge>
              </div>

              {/* SOCIAL PROOF */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pt-2">
                <div className="flex -space-x-4">
                  {[1, 2, 3, 4].map((i) => (
                    <Image
                      key={i}
                      w={52}
                      h={52}
                      radius="xl"
                      className="border-4 border-white dark:border-slate-900 shadow-md"
                      src={`https://i.pravatar.cc/150?img=${i + 10}`}
                    />
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-extrabold text-2xl text-slate-900 dark:text-white">2,000+</span>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium tracking-wide">
                    Doctors trust Pulse daily
                  </p>
                </div>
              </div>

            </Grid.Col>

            {/* VISUAL SIDE */}
            <Grid.Col span={{ base: 12, md: 6, lg: 5 }} className="relative mt-16 md:mt-0">
              <div className="relative w-full perspective-1000">
                {/* Main Image Container */}
                <div className="relative z-10 rounded-3xl shadow-2xl dark:shadow-black/50 overflow-hidden border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <Image
                    src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d"
                    className="w-full object-cover opacity-90 dark:opacity-80 h-[450px]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent dark:from-black/60"></div>
                </div>

                {/* Floating Cards: Dark Mode Classes Added */}
                <div className="absolute -left-12 top-12 z-20 p-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.5)] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-white/50 dark:border-slate-700 w-64 hidden lg:block animate-float">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                      <IconCheck size={20} stroke={3} />
                    </div>
                    <div>
                      <Text size="sm" fw={800} c="green.8" className="dark:text-green-400" lh={1.2}>Confirmed</Text>
                      <Text size="xs" c="dimmed" fw={500}>Notification sent</Text>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-slate-800 rounded-xl p-3 border border-slate-100 dark:border-slate-700">
                     <Text size="sm" fw={700} className="text-slate-800 dark:text-slate-200 mb-1">Dr. Sarah Johnson</Text>
                     <Text size="xs" c="dimmed" fw={500}>General Checkup • 10:30 AM</Text>
                  </div>
                </div>

                {/* Floating Card 2 */}
                <div className="absolute -right-8 bottom-12 z-20 p-5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.5)] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-white/50 dark:border-slate-700 w-52 hidden lg:block animate-float-delayed">
                  <Text size="xs" c="dimmed" fw={700} mb={2} className="uppercase tracking-wider">Daily Patients</Text>
                  <div className="flex items-baseline gap-2">
                    <Text size="3xl" fw={800} className="text-slate-900 dark:text-white leading-none">142</Text>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full">
                      +12%
                    </span>
                  </div>
                  <div className="mt-3 h-1.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-teal-400 to-blue-500 w-[70%] rounded-full"></div>
                  </div>
                </div>

              </div>
            </Grid.Col>

          </Grid>
        </Container>
      </div>

{/* ==========================================
          2. AMBULANCE LIVE TRACKING (Light & Dark Compatible)
      ========================================== */}
      <div id="ambulance" className="py-32 bg-slate-50 dark:bg-[#0B1120] relative overflow-hidden border-t border-slate-200 dark:border-slate-800 transition-colors duration-500">

        {/* Tech Grid Background: Adjusts opacity for Light/Dark */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:40px_40px] opacity-30 dark:opacity-20"></div>

        {/* Ambient Glow: Teal in Dark, Blue in Light */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[800px] h-[800px] bg-blue-200/40 dark:bg-teal-500/10 rounded-full blur-[120px] pointer-events-none"></div>

        <Container size="xl" className="relative z-10">
          <Grid gutter={100} align="center">

            {/* TEXT CONTENT */}
            <Grid.Col span={{ base: 12, md: 5 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-teal-900/30 border border-blue-200 dark:border-teal-500/30 text-blue-700 dark:text-teal-300 text-xs font-bold uppercase tracking-wider mb-6 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-blue-500 dark:bg-teal-400 animate-pulse"></span>
                Emergency Response System
              </div>

              <Title className="text-4xl md:text-6xl font-bold mb-6 leading-[1.1] text-slate-900 dark:text-white">
                Every Second <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-teal-400 dark:to-cyan-400">
                  Truly Counts.
                </span>
              </Title>

              <Text className="text-slate-600 dark:text-slate-400 text-lg mb-10 leading-relaxed font-medium">
                Our intelligent dispatch system calculates the fastest route in real-time. Hospitals get live ETA updates to prepare the ER before the patient arrives.
              </Text>

              <Stack gap="lg">
                {[
                  { title: "GPS Fleet Tracking", desc: "Monitor exact location of every unit." },
                  { title: "Automated Routing", desc: "AI-driven pathfinding avoids traffic." },
                  { title: "Instant Alerts", desc: "SMS & App notifications for patients." }
                ].map((item, idx) => (
                  <Group key={idx} align="start" gap="md">
                    <div className="mt-1 p-2 rounded-lg bg-white dark:bg-teal-500/10 border border-slate-200 dark:border-teal-500/20 text-blue-600 dark:text-teal-400 shadow-sm">
                      <IconCheck size={18} stroke={3} />
                    </div>
                    <div>
                      <Text fw={700} className="text-slate-900 dark:text-slate-100">{item.title}</Text>
                      <Text size="sm" className="text-slate-500 dark:text-slate-500">{item.desc}</Text>
                    </div>
                  </Group>
                ))}
              </Stack>

              <div className="mt-10 pt-8 border-t border-slate-200 dark:border-slate-800 flex gap-8">
                <div>
                  <Text size="2xl" fw={800} className="text-slate-900 dark:text-white">8m</Text>
                  <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Avg Response</Text>
                </div>
                <div>
                  <Text size="2xl" fw={800} className="text-slate-900 dark:text-white">24/7</Text>
                  <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Availability</Text>
                </div>
              </div>
            </Grid.Col>

            {/* VISUAL CONTENT */}
            <Grid.Col span={{ base: 12, md: 7 }}>
              <div className="relative perspective-1000 group">
                
                {/* Main Dashboard Container */}
                <div className="relative rounded-3xl bg-white dark:bg-[#161E2E] border border-slate-200 dark:border-slate-700 p-2 shadow-2xl dark:shadow-[0_0_50px_rgba(20,184,166,0.15)] transform transition-transform duration-700 group-hover:rotate-x-2">
                  
                  <div className="relative rounded-2xl overflow-hidden h-[450px] w-full bg-slate-100 dark:bg-slate-900">
                    
                    {/* Map Image: Light mode uses standard map, Dark mode uses dark map */}
                    <Image
                      src="https://assets-global.website-files.com/5a0557e23997b90001f4ca10/634e8e8c0f61cb09647046c3_google-maps-dark-mode.jpg"
                      className="w-full h-full object-cover opacity-80 dark:opacity-60 dark:grayscale-[30%] mix-blend-normal dark:mix-blend-luminosity"
                    />
                    
                    {/* Route Overlay */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ filter: 'drop-shadow(0 0 4px #0ea5e9)' }}>
                      <path d="M 100 350 Q 250 350 300 250 T 550 150" fill="none" stroke="#0ea5e9" strokeWidth="4" strokeDasharray="10 5" strokeLinecap="round" className="animate-dash" />
                      <circle cx="550" cy="150" r="8" fill="#ef4444" stroke="white" strokeWidth="3" />
                    </svg>

                    {/* Pulse Animation */}
                    <div className="absolute top-[240px] left-[290px] w-20 h-20 -ml-10 -mt-10 pointer-events-none">
                      <span className="absolute inset-0 rounded-full bg-blue-500 dark:bg-teal-500 opacity-20 animate-ping"></span>
                      <span className="absolute inset-4 rounded-full bg-blue-500 dark:bg-teal-500 opacity-40 animate-pulse"></span>
                    </div>

                    {/* Floating Status Widget (Top Left) */}
                    <div className="absolute top-6 left-6 bg-white/90 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-600 p-4 rounded-xl w-64 shadow-lg">
                      <div className="flex justify-between items-center mb-3">
                        <Group gap={6}>
                          <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                          </span>
                          <Text size="xs" fw={700} tt="uppercase" className="text-slate-800 dark:text-white">Live Mission</Text>
                        </Group>
                        <Badge size="xs" color="red" variant="filled">CRITICAL</Badge>
                      </div>
                      <Text size="sm" fw={600} className="text-slate-900 dark:text-white mb-4">Unit 402 → City Hospital</Text>
                      <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
                        <span>ETA: 4 mins</span>
                        <span>1.2 km left</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-blue-500 dark:bg-gradient-to-r dark:from-teal-500 dark:to-cyan-400 w-[75%] h-full rounded-full"></div>
                      </div>
                    </div>

                    {/* Floating Driver Card (Bottom Right) */}
                    <div className="absolute bottom-6 right-6 bg-white dark:bg-white text-slate-900 p-4 rounded-xl w-72 shadow-2xl border border-slate-100 dark:border-none flex items-center gap-4 animate-float-delayed">
                      <div className="bg-orange-100 p-3 rounded-lg text-orange-600">
                        <IconAmbulance size={32} />
                      </div>
                      <div>
                        <Text fw={800} size="sm">ICU Ambulance</Text>
                        <Text size="xs" c="dimmed" fw={500}>Paramedic: Rajesh Kumar</Text>
                        <Group gap={6} mt={4}>
                          <Badge size="xs" color="teal" variant="light">Oxygen</Badge>
                          <Badge size="xs" color="blue" variant="light">Defib</Badge>
                        </Group>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </Grid.Col>
          </Grid>
        </Container>
      </div>

{/* ==========================================
          3. ECOSYSTEM (Static & Clean Layout)
      ========================================== */}
      <div id="features" className="py-32 bg-slate-50 dark:bg-[#0B1120] overflow-hidden transition-colors duration-500">
        <Container size="xl">
          
          {/* Section Header */}
          <div className="text-center mb-24 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-6 shadow-sm">
              <IconBolt size={14} />
              The Pulse Ecosystem
            </div>
            <Title className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight leading-tight">
              Run your hospital like <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400">
                a technology company.
              </span>
            </Title>
            <Text className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              We replaced the clutter of spreadsheets and legacy software with a unified operating system that offers stability and speed.
            </Text>
          </div>

          <div className="flex flex-col gap-24">

            {/* FEATURE 1: SMART BILLING */}
            <Grid gutter={60} align="center">
              <Grid.Col span={{ base: 12, md: 6 }}>
                <div className="relative">
                  {/* Static Background Shape */}
                  <div className="absolute inset-0 bg-indigo-500/10 rounded-3xl transform translate-x-4 translate-y-4 -z-10"></div>
                  
                  {/* Mockup Card */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-8">
                    <div className="flex justify-between items-center mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600">
                          <IconReceipt2 size={20} />
                        </div>
                        <div>
                          <Text size="sm" fw={700} c="dark" className="dark:text-white">Invoice #1024</Text>
                          <Text size="xs" c="dimmed">Due: Today</Text>
                        </div>
                      </div>
                      <Badge color="orange" variant="light">Pending</Badge>
                    </div>
                    <Stack gap="xs" mb="lg">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500 dark:text-slate-400">Consultation Fee</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-200">$50.00</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500 dark:text-slate-400">Lab Tests (x2)</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-200">$120.00</span>
                      </div>
                      <div className="flex justify-between text-sm pt-4 border-t border-slate-100 dark:border-slate-800">
                        <span className="font-bold text-slate-900 dark:text-white">Total</span>
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">$170.00</span>
                      </div>
                    </Stack>
                    <Button fullWidth color="indigo" radius="md" size="md">Process Payment</Button>
                  </div>
                </div>
              </Grid.Col>
              
              <Grid.Col span={{ base: 12, md: 6 }} className="pl-0 md:pl-10">
                <ThemeIcon size={56} radius="xl" color="indigo" variant="light" className="mb-6">
                  <IconReceipt2 size={28} stroke={2} />
                </ThemeIcon>
                <Title order={2} className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                  Automated Billing & Insurance
                </Title>
                <Text className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                  Stop chasing payments. Pulse automatically generates invoices based on doctor visits, lab tests, and pharmacy orders.
                </Text>
                <Stack gap="md">
                  {[
                    "One-click invoice generation",
                    "Integrated Payment Gateways (Razorpay)",
                    "Automated Tax & GST Calculations"
                  ].map((item, i) => (
                    <Group key={i} gap="sm">
                      <IconCheck className="text-indigo-500" size={20} />
                      <Text className="text-slate-700 dark:text-slate-300 font-medium">{item}</Text>
                    </Group>
                  ))}
                </Stack>
              </Grid.Col>
            </Grid>

            {/* FEATURE 2: PHARMACY (Reversed Layout) */}
            <Grid gutter={60} align="center" className="flex-row-reverse">
              {/* Visual Side */}
              <Grid.Col span={{ base: 12, md: 6 }} order={{ base: 1, md: 2 }}>
                <div className="relative">
                  <div className="absolute inset-0 bg-teal-500/10 rounded-3xl transform -translate-x-4 translate-y-4 -z-10"></div>
                  
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-8">
                    <div className="flex justify-between items-center mb-6">
                      <Text fw={700} size="lg" className="dark:text-white">Inventory Status</Text>
                      <Badge color="teal" variant="light">Live Updates</Badge>
                    </div>
                    <Stack gap="lg">
                      {[
                        { name: "Amoxicillin 500mg", stock: 85, color: "bg-teal-500" },
                        { name: "Paracetamol", stock: 15, color: "bg-red-500", warning: true },
                        { name: "Insulin Shots", stock: 60, color: "bg-blue-500" }
                      ].map((item, idx) => (
                        <div key={idx}>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="font-medium text-slate-700 dark:text-slate-300">{item.name}</span>
                            {item.warning ? (
                              <span className="text-red-500 font-bold text-xs">LOW STOCK</span>
                            ) : (
                              <span className="text-slate-500 text-xs">{item.stock}%</span>
                            )}
                          </div>
                          <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.stock}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </Stack>
                  </div>
                </div>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 6 }} order={{ base: 2, md: 1 }}>
                <ThemeIcon size={56} radius="xl" color="teal" variant="light" className="mb-6">
                  <IconPill size={28} stroke={2} />
                </ThemeIcon>
                <Title order={2} className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                  Smart Pharmacy Management
                </Title>
                <Text className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                  Prevent stockouts before they happen. Pulse tracks every pill dispensed and alerts you when inventory gets low.
                </Text>
                <Stack gap="md">
                  {[
                    "Batch & Expiry Date Tracking",
                    "Direct Prescription Integration",
                    "Low Stock Alerts via Email/SMS"
                  ].map((item, i) => (
                    <Group key={i} gap="sm">
                      <IconCheck className="text-teal-500" size={20} />
                      <Text className="text-slate-700 dark:text-slate-300 font-medium">{item}</Text>
                    </Group>
                  ))}
                </Stack>
              </Grid.Col>
            </Grid>

            {/* FEATURE 3: BLOOD BANK */}
            <Grid gutter={60} align="center">
              <Grid.Col span={{ base: 12, md: 6 }}>
                <div className="relative">
                  <div className="absolute inset-0 bg-red-500/10 rounded-3xl transform translate-x-4 translate-y-4 -z-10"></div>
                  
                  <div className="z-10 grid grid-cols-2 gap-4">
                    {['A+', 'O+', 'B-', 'AB+'].map((type, i) => (
                      <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-lg">
                        <div className="flex justify-between items-start mb-4">
                          <IconDroplet className="text-red-500" size={24} />
                          <Text fw={800} size="xl" className="dark:text-white">{type}</Text>
                        </div>
                        <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Available</Text>
                        <Text size="lg" fw={700} className="text-slate-700 dark:text-slate-200">
                          {Math.floor(Math.random() * 20) + 5} Units
                        </Text>
                      </div>
                    ))}
                  </div>
                </div>
              </Grid.Col>
              
              <Grid.Col span={{ base: 12, md: 6 }} className="pl-0 md:pl-10">
                <ThemeIcon size={56} radius="xl" color="red" variant="light" className="mb-6">
                  <IconDroplet size={28} stroke={2} />
                </ThemeIcon>
                <Title order={2} className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                  Emergency Blood Bank
                </Title>
                <Text className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                  In emergencies, finding the right blood type instantly is critical. Manage donors and inventory with zero latency.
                </Text>
                <Stack gap="md">
                  {[
                    "Donor Database Management",
                    "Real-time Blood Group Availability",
                    "Cross-matching & Issue Tracking"
                  ].map((item, i) => (
                    <Group key={i} gap="sm">
                      <IconCheck className="text-red-500" size={20} />
                      <Text className="text-slate-700 dark:text-slate-300 font-medium">{item}</Text>
                    </Group>
                  ))}
                </Stack>
              </Grid.Col>
            </Grid>

          </div>
        </Container>
      </div>

      
      {/* ==========================================
          4. EXPERT DOCTORS (Redesigned)
      ========================================== */}
      <div id="doctors" className="py-24 bg-slate-50 dark:bg-[#0B1120] relative overflow-hidden border-t border-slate-200 dark:border-slate-800">
        {/* Background Decoration */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] opacity-30"></div>

        <Container size="xl" className="relative z-10">
          <div className="!text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-800 text-teal-700 dark:text-teal-300 text-xs font-bold uppercase tracking-wider mb-4">
              <IconStethoscope size={14} stroke={3} />
              World-Class Care
            </div>
            <Title className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              Meet Our Medical Experts
            </Title>
            <div className='flex justify-center items-center'>
              <Text className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                We have assembled a team of distinguished specialists from top medical institutions worldwide to ensure you receive the best care possible.
              </Text>
            </div>
          </div>

          <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="xl">
            {[
              {
                name: 'Dr. Sarah Johnson',
                dept: 'Cardiology',
                exp: '12 Yrs',
                rating: '4.9',
                img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=800'
              },
              {
                name: 'Dr. James Lee',
                dept: 'Neurology',
                exp: '15 Yrs',
                rating: '5.0',
                img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=800'
              },
              {
                name: 'Dr. Anita Roy',
                dept: 'Pediatrics',
                exp: '9 Yrs',
                rating: '4.8',
                img: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=800'
              },
              {
                name: 'Dr. Kevin White',
                dept: 'Orthopedics',
                exp: '18 Yrs',
                rating: '4.9',
                img: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800'
              }
            ].map((doc, idx) => (
              <div key={idx} className="group relative bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-2xl hover:shadow-teal-900/5 dark:hover:shadow-black/40 transition-all duration-500">

                {/* Image Container */}
                <div className="relative h-72 overflow-hidden rounded-t-2xl">
                  <Image
                    src={doc.img}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    alt={doc.name}
                  />

                  {/* Gradient Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Department Badge */}
                  <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-3 py-1 rounded-md text-xs font-bold text-slate-800 dark:text-white shadow-sm border border-white/50 dark:border-slate-600">
                    {doc.dept}
                  </div>

                  {/* Social Icons (Slide up on hover) */}
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-75">
                    <ActionIcon variant="filled" color="white" className="!text-slate-900 hover:!text-blue-600" radius="xl" size="lg">
                      <IconBrandLinkedin size={18} />
                    </ActionIcon>
                    <ActionIcon variant="filled" color="white" className="!text-slate-900 hover:!text-sky-100" radius="xl" size="lg">
                      <IconBrandX size={18} />
                    </ActionIcon>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <Text fw={800} size="lg" className="text-slate-800 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                        {doc.name}
                      </Text>
                      <Text size="xs" c="dimmed" fw={500} className="uppercase tracking-wide">
                        Senior Consultant
                      </Text>
                    </div>
                  </div>

                  {/* Stats Row */}
                  <div className="flex items-center gap-4 py-3 border-t border-slate-100 dark:border-slate-700 mb-4">
                    <div className="flex items-center gap-1.5">
                      <IconBriefcase size={16} className="text-teal-500" />
                      <Text size="sm" fw={600} c="white" className="dark:text-slate-300">{doc.exp}</Text>
                    </div>
                    <div className="w-px h-4 bg-slate-200 dark:bg-slate-700"></div>
                    <div className="flex items-center gap-1.5">
                      <IconStar size={16} className="text-yellow-500 fill-yellow-500" />
                      <Text size="sm" fw={600} c="white" className="dark:text-slate-300">{doc.rating}</Text>
                    </div>
                  </div>

                  <Button
                    fullWidth
                    variant="outline"
                    color="slate"
                    radius="md"
                    rightSection={<IconArrowRight size={16} />}
                    className="border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-900 dark:hover:bg-white hover:text-white dark:hover:text-slate-900 transition-all"
                  >
                    Book Appointment
                  </Button>
                </div>
              </div>
            ))}
          </SimpleGrid>
        </Container>
      </div>

      {/* ==========================================
          5. CTA SECTION
      ========================================== */}
      <div id="contact" className="py-24 bg-slate-50 dark:bg-[#0B1120] transition-colors duration-500">
        <Container size="xl">
          <div className="bg-white dark:bg-slate-800 rounded-[2rem] shadow-xl dark:shadow-black/40 overflow-hidden border border-slate-100 dark:border-slate-700 flex flex-col md:flex-row transition-colors duration-500">
            <div className="p-10 md:p-16 md:w-1/2 bg-slate-900 dark:bg-slate-950 text-white">
              <Text className="text-teal-400 font-bold uppercase tracking-widest text-sm mb-2">Contact Us</Text>
              <Title className="text-4xl font-bold mb-6 text-white">Get in touch with our team.</Title>
              <Text className="text-slate-400 mb-8">Whether you have questions about features, pricing, or need a demo, we’re here to help.</Text>

              <Stack gap="lg">
                <Group>
                  <IconPhone className="text-teal-400" />
                  <Text className="text-slate-200">+91 98765 43210</Text>
                </Group>
                <Group>
                  <IconMail className="text-teal-400" />
                  <Text className="text-slate-200">sales@pulse-hms.com</Text>
                </Group>
                <Group>
                  <IconMapPin className="text-teal-400" />
                  <Text className="text-slate-200">123 Health Tech Park, Mumbai</Text>
                </Group>
              </Stack>
            </div>
            <div className="p-10 md:p-16 md:w-1/2 dark:text-white">
              <Stack gap="md">
                <div className="grid grid-cols-2 gap-4">
                  <TextInput 
                    label="First Name" 
                    placeholder="John" 
                    size="md" 
                    classNames={{ 
                      input: 'dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400',
                      label: 'dark:text-slate-300'
                    }} 
                  />
                  <TextInput 
                    label="Last Name" 
                    placeholder="Doe" 
                    size="md" 
                    classNames={{ 
                      input: 'dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400',
                      label: 'dark:text-slate-300'
                    }} 
                  />
                </div>
                <TextInput 
                  label="Email" 
                  placeholder="john@hospital.com" 
                  size="md" 
                  classNames={{ 
                    input: 'dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400',
                    label: 'dark:text-slate-300'
                  }} 
                />
                <Textarea
                  label="Message" 
                  placeholder="Tell us about your hospital needs..." 
                  minRows={4} 
                  size="md" 
                  classNames={{ 
                    input: 'dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400',
                    label: 'dark:text-slate-300'
                  }} 
                />
                <Button size="xl" fullWidth color="teal" radius="md">Send Message</Button>
              </Stack>
            </div>
          </div>
        </Container>
      </div>

      <PublicFooter />
    </div>
  );
};

export default LandingPage;