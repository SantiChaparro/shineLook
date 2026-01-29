import { useEffect, useState } from "react";
import "./App.css";
import SideBar from "./components/navBar/SideBar";
import Landing from "./views/Landing/Landing";
import TenantSelector from "./components/TenantSelector";
import {storageTenantId} from './redux/slices/tenantsSlice';
import { useDispatch } from 'react-redux';
import {jwtDecode} from 'jwt-decode';
import { Routes, Route } from "react-router-dom";
import ConfirmRating from "./views/ConfirmRating";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [verifyUser, setVerifyUser] = useState(false);
  const [loggedUser, setLoggedUser] = useState(null);
  const [selectedTenant, setSelectedTenant] = useState("");
  const [showTenantModal, setShowTenantModal] = useState(false);
  const [tenantOptions, setTenantOptions] = useState([]);
  const [userRole, setUserRole] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    const user = localStorage.getItem("loggedUser");
  
    if (user) {
      const parsedUser = JSON.parse(user);
      setLoggedUser(parsedUser);
      setIsLoggedIn(true);
      setVerifyUser(true);

      const token = jwtDecode(parsedUser.tokken);
      setUserRole(token.role);

      let tenants = parsedUser.tenants;

      if (!Array.isArray(tenants)) tenants = [tenants];
      setTenantOptions(tenants);

      if (tenants.length > 0 && !selectedTenant) {
        setShowTenantModal(true);
      }

    } else {
      setShowTenantModal(false);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if(selectedTenant){
      dispatch(storageTenantId({ tenantId: selectedTenant }));
      localStorage.setItem("selectedTenant", selectedTenant);
    }
  }, [selectedTenant]);


  const handleLogin = () => setIsLoggedIn(true);
  const HandleVerifyUser = () => setVerifyUser(true);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setVerifyUser(false);
    setLoggedUser(null);
    setSelectedTenant("");
    localStorage.removeItem("loggedUser");
    localStorage.removeItem("selectedtenant");
    setTenantOptions([]);
  };

  return (
    <div className="App">

      {/* RUTAS PÚBLICAS */}
      <Routes>
        {/* ESTA ES TU VISTA QUE DEBE RENDERIZARSE SOLA */}
        <Route path="/confirm-rating" element={<ConfirmRating />} />

        {/* Landing solo si no está logueado */}
        {!isLoggedIn && (
          <Route 
            path="*" 
            element={
              <Landing 
                onLogin={handleLogin}
                HandleVerifyUser={HandleVerifyUser}
              />
            } 
          />
        )}
      </Routes>


      {/* RUTAS PRIVADAS */}
      {isLoggedIn && verifyUser && loggedUser && (
        userRole === "Owner"
          ? <h1>Dashboard Owner</h1>
          : (
            selectedTenant 
              ? <SideBar onLogout={handleLogout} selectedtenant={selectedTenant} />
              : <TenantSelector 
                  open={showTenantModal}
                  tenants={tenantOptions}
                  onSelectTenant={setSelectedTenant}
                />
          )
      )}

    </div>
  );
}

export default App;
