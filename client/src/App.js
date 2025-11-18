import { useEffect, useState } from "react";
import "./App.css";
import SideBar from "./components/navBar/SideBar";
import Landing from "./views/Landing/Landing";
import TenantSelector from "./components/TenantSelector"; // Asegurate de que esta ruta sea correcta
import {storageTenantId} from './redux/slices/tenantsSlice';
import { useDispatch } from 'react-redux';
import {jwtDecode} from 'jwt-decode';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [verifyUser, setVerifyUser] = useState(false);
  const [loggedUser, setLoggedUser] = useState(null);
  const [selectedTenant, setSelectedTenant] = useState("");
  const [showTenantModal, setShowTenantModal] = useState(false);
  const [tenantOptions, setTenantOptions] = useState([]);
  const [userRole, setUserRole] = useState("");
  const dispatch = useDispatch();

  console.log('loggeduser desde app.js',loggedUser);
  console.log('userRole desde app.js',userRole);
  
  // console.log(tenantOptions);
  // console.log(verifyUser);
  
  // console.log(isLoggedIn);
  // console.log(selectedTenant);
  // console.log(showTenantModal);
  
  
  
  
  

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const HandleVerifyUser = () => {
    setVerifyUser(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setVerifyUser(false);
    setLoggedUser(null);
    setSelectedTenant("");
    localStorage.removeItem("loggedUser");
    localStorage.removeItem("selectedtenant");
    setLoggedUser(null);
    setTenantOptions([]);
    setSelectedTenant("");
  };

  useEffect(() => {
    //localStorage.removeItem("loggedUser");
    const user = localStorage.getItem("loggedUser");
    console.log("user sacado del storage", user);
  
    if (user) {
      const parsedUser = JSON.parse(user);
      setLoggedUser(parsedUser);
      setIsLoggedIn(true);
      setVerifyUser(true);
      const token = jwtDecode(parsedUser.tokken);
      console.log("Decoded Token desde el app.js", token.role);
      setUserRole(token.role);
  
      let tenants = parsedUser.tenants;
  
      // Normalizamos a array
      if (!Array.isArray(tenants)) {
        tenants = [tenants];
      }
  
      setTenantOptions(tenants);
  
      if (tenants.length > 0 && !selectedTenant) {
        setShowTenantModal(true);
      }
    } else {
      // Si no hay usuario logueado, ocultar modal por si quedó abierto de antes
      setShowTenantModal(false);
    }
  }, [isLoggedIn,userRole]);

  useEffect(() => {
    if(selectedTenant){
      dispatch(storageTenantId({ tenantId: selectedTenant }));
      localStorage.setItem("selectedTenant", selectedTenant);
    }
  }, [selectedTenant]);
  

  const handleTenantSelect = (tenantId) => {
    setSelectedTenant(tenantId);
    setShowTenantModal(false);
  };

  
  return (
    <div className="App">
{isLoggedIn && verifyUser && loggedUser ? (
  userRole === "Owner" ? (
    // Si es owner, va a mostrar el dashboard de owner
    <h1>estas en dashboard owner</h1>
   // <SideBar onLogout={handleLogout}  />
  ) : (
    // Si NO es owner, primero el TenantSelector
    selectedTenant ? (
      <SideBar
        onLogout={handleLogout}
        selectedtenant={selectedTenant}
        //userRole={userRole}
      />
    ) : (
      <TenantSelector 
      open={showTenantModal}
      tenants={tenantOptions}
      onSelectTenant={handleTenantSelect}
      />
    )
  )
) : (
  <Landing
    onLogin={handleLogin}
    HandleVerifyUser={HandleVerifyUser}
  />
)}

{/* <TenantSelector
  open={showTenantModal}
  tenants={tenantOptions}
  onSelectTenant={handleTenantSelect}
/> */}
    </div>
  );
}

export default App;



// si no anda lo de owner pones esto de nuevo

//  return (
//     <div className="App">
//           {isLoggedIn && verifyUser && selectedTenant && loggedUser ? (
//   <SideBar onLogout={handleLogout} selectedtenant={selectedTenant} />
// ) : (
//   <Landing
//     onLogin={handleLogin}
//     HandleVerifyUser={HandleVerifyUser}
//   />
// )}
// <TenantSelector
//   open={showTenantModal}
//   tenants={tenantOptions}
//   onSelectTenant={handleTenantSelect}
// />
//     </div>
//   );



// import { useEffect, useState } from "react";
// import "./App.css";
// import SideBar from "./components/navBar/SideBar";
// import Landing from "./views/Landing/Landing";




// function App() {

//     const [isLoggedIn , setIsLoggedIn] = useState(false);
//     const [verifyUser , setVerifyUser] = useState(false);
//     const [loggedUser , setLoggedUser] = useState("");
//     const [selectedTenant , setSelectedTenant] = useState("");
//     console.log(loggedUser);
    
//     const handleLogin = () => {

//       setIsLoggedIn(true);

//     };

//     const HandleVerifyUser = () => {

//       setVerifyUser(true);

//     };

//     const handleLogout = () => {
//       setIsLoggedIn(false);
//       setVerifyUser(false);
//       setLoggedUser("");
//       localStorage.removeItem('loggedUser');
//   };
//   useEffect(() => {
//     // Verificar si hay un usuario logueado en el almacenamiento local
//     const user = localStorage.getItem("loggedUser");
  
  
//     if (user) {
//       setIsLoggedIn(true);
//       setLoggedUser(user);
//       setVerifyUser(true);
//     } 
//   }, [loggedUser]);

//   // aca antes de renderizar el sidebar debo preguntarle al usuario que tenant seleccionara

//   return (
//     <div className="App">
//       {((loggedUser || verifyUser)&& isLoggedIn) ? (
//         <SideBar onLogout={handleLogout} />
//       ) : <Landing onLogin={handleLogin} HandleVerifyUser={HandleVerifyUser} />} 
//   </div>
//   );
// }

// export default App;