


import Sidebar from '../Admin/Sidebar/Sidebar';
import Header from '../Headers/Header';
import { Outlet } from 'react-router-dom';

const AdminLayoutPage = () => {
  return (
   
     
    <div className="flex !h-full">
       <Sidebar/>

       <div className="w-full flex flex-col">   
          <Header/>
         <Outlet/>
       </div>
     
    </div>
   
  )
}

export default AdminLayoutPage
