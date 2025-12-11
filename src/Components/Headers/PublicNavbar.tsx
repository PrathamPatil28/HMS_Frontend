import { Group, Button, Box, Burger, Drawer, ScrollArea, Text, Container } from '@mantine/core';
import { useDisclosure, useWindowScroll } from '@mantine/hooks';
import { IconHeartbeat, IconArrowRight } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { ThemeToggle } from '../../util/ThemeToggle';


const PublicNavbar = () => {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
  const [scroll] = useWindowScroll();
  const navigate = useNavigate();

  const isScrolled = scroll.y > 20;

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
      closeDrawer();
    }
  };

  const menuItems = [
    { label: 'Features', id: 'features' },
    { label: 'Technology', id: 'ambulance' },
    { label: 'Doctors', id: 'doctors' },
    { label: 'Contact', id: 'contact' },
  ];

  return (
    <Box 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg shadow-sm border-b border-slate-200/50 dark:border-slate-800/50 py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <Container size="xl">
        <header className="flex justify-between items-center h-10">
          
          {/* Logo Area */}
          <Group gap={10} className="cursor-pointer select-none" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="bg-gradient-to-br from-teal-500 to-blue-600 p-1.5 rounded-lg text-white shadow-lg shadow-teal-500/20 transition-transform hover:scale-105 duration-300">
                <IconHeartbeat size={26} stroke={2.5} />
            </div>
            <Text className="!font-black !text-3xl !text-slate-800 dark:!text-white !tracking-tight">Pulse</Text>
          </Group>

          {/* Desktop Menu */}
          <Group gap={40} visibleFrom="md">
            {menuItems.map((item) => (
                <button 
                    key={item.id}
                    onClick={() => scrollToSection(item.id)} 
                    className="text-[15px] cursor-pointer font-semibold text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors relative group"
                >
                    {item.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal-500 dark:bg-teal-400 transition-all duration-300 group-hover:w-full rounded-full"></span>
                </button>
            ))}
          </Group>

          {/* Desktop Actions */}
          <Group visibleFrom="sm" gap="md">
            <ThemeToggle /> {/* Added Toggle Here */}
            
            <Button 
                variant="subtle" 
                color="gray" 
                radius="xl"
                onClick={() => navigate('/login')}
                className="font-semibold !text-slate-600 dark:!text-slate-300 hover:!text-slate-900 dark:hover:!text-white hover:!bg-slate-100 dark:hover:!bg-slate-800"
            >
                Log in
            </Button>
            <Button 
                radius="xl" 
                size="sm"
                className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 transition-all hover:shadow-lg hover:-translate-y-0.5 px-6 h-10"
                onClick={() => navigate('/register')}
                rightSection={<IconArrowRight size={16} />}
            >
                Get Started
            </Button>
          </Group>

          {/* Mobile Burger */}
          <Burger opened={drawerOpened} onClick={toggleDrawer} hiddenFrom="sm" size="sm" color="gray" />
        </header>
      </Container>

      {/* Mobile Drawer */}
      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="xl"
        hiddenFrom="sm"
        zIndex={1000000}
        withCloseButton={false}
        classNames={{ content: 'dark:bg-slate-950' }} // Dark background for drawer
        transitionProps={{ duration: 200, timingFunction: 'ease' }}
      >
        <div className="flex flex-col h-full dark:text-white">
            <div className="flex justify-between items-center mb-8">
                <Group gap={10}>
                    <div className="bg-teal-500 p-1.5 rounded-lg text-white">
                        <IconHeartbeat size={22} stroke={2.5} />
                    </div>
                    <Text className="font-black text-2xl text-slate-800 dark:text-white">Pulse</Text>
                </Group>
                <div className="flex gap-4">
                    <ThemeToggle />
                    <Burger opened={drawerOpened} onClick={closeDrawer} size="sm" />
                </div>
            </div>

            <ScrollArea className="flex-1 -mx-4 px-4">
                <div className="flex flex-col gap-2">
                    {menuItems.map((item) => (
                        <a 
                            key={item.id} 
                            onClick={() => scrollToSection(item.id)} 
                            className="block px-4 py-4 text-xl font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl transition-colors"
                        >
                            {item.label}
                        </a>
                    ))}
                </div>
            </ScrollArea>

            <div className="mt-auto pt-8 border-t border-slate-100 dark:border-slate-800">
                <Button fullWidth variant="outline" size="lg" radius="xl" onClick={() => navigate('/login')} className="mb-3 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                    Log in
                </Button>
                <Button fullWidth color="teal" size="lg" radius="xl" onClick={() => navigate('/register')}>
                    Get Started
                </Button>
            </div>
        </div>
      </Drawer>
    </Box>
  );
}

export default PublicNavbar;