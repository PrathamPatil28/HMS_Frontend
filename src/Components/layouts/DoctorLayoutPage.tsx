
import Sidebar from '../Doctor/Sidebar/Sidebar';
import Header from '../Headers/Header';
import { Outlet } from 'react-router-dom';


const DoctorLayoutPage = () => {
  return (
   
     
    <div className="flex !h-full">
       <Sidebar/>

       <div className="w-full flex flex-col overflow-hidden">
          <Header/>
         <Outlet/>
       </div>
     
    </div>
   
  )
}

export default DoctorLayoutPage
