
import Header from '../Headers/Header';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Patient/Sidebar/Sidebar';

const PatientDashboard = () => {
  return (
   
     
    <div className="flex !h-full">
       <Sidebar/>

       <div className="w-full overflow-hidden flex flex-col">
          <Header/>
         <Outlet/>
       </div>
     
    </div>
   
  )
}

export default PatientDashboard
