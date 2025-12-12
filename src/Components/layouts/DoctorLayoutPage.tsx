
import Sidebar from '../Doctor/Sidebar/Sidebar';
import Header from '../Headers/Header';
import { Outlet } from 'react-router-dom';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';

const DoctorLayoutPage = () => {
  // Check if screen is small (mobile)
  const isMobile = useMediaQuery('(max-width: 768px)');

  // State for Mobile Drawer
  const [mobileOpened, { toggle: toggleMobile, close: closeMobile }] = useDisclosure(false);

  // State for Desktop Sidebar Collapse
  const [desktopCollapsed, { toggle: toggleDesktop }] = useDisclosure(false);

  // Unified toggle function passed to Header
  const handleSidebarToggle = () => {
    if (isMobile) {
      toggleMobile();
    } else {
      toggleDesktop();
    }
  };

  return (
    <div className="flex !h-full dark:bg-gray-900 bg-white transition-colors duration-300">
       <Sidebar 
          mobileOpened={mobileOpened} 
          closeMobile={closeMobile}
          desktopCollapsed={desktopCollapsed}
       />

       <div className="w-full flex flex-col h-screen overflow-hidden">
          <Header toggleSidebar={handleSidebarToggle} />
          
          <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-4 transition-colors duration-300">
             <Outlet/>
          </div>
       </div>
    </div>
  )
}

export default DoctorLayoutPage