import './App.css'
import EmpDetail from './components/profiles/employee/EmpDetail';
import LeaveApplicationForm from './layouts/forms/LeaveApplicationForm';
import Login from './layouts/forms/Login';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import ManagerDetail from './components/profiles/manager/ManagerDetail';
import Admin from './components/profiles/admin/Admin';
import ProjectForm from './components/profiles/admin/ProjectCreate';
import EmployeeSignupForm from './components/profiles/admin/Register';

function App() {
  return (
    <div className="App">

<BrowserRouter>
<Routes>
  
  <Route path="/" element={<Login/>} />
  <Route path="/register" element={<EmployeeSignupForm />} />
  <Route path="/projects" element={<ProjectForm />} />
  <Route path="/detail" element={<EmpDetail />} />
  <Route path="/leave" element={<LeaveApplicationForm/>} />
  <Route path = "/manager-dashboard" element={<ManagerDetail/>}/>
  <Route path ="/admin" element={<Admin/>}/>
</Routes>
</BrowserRouter>
     
    </div>
  );
}

export default App;
