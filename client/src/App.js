import { useEffect, useState } from "react";
import "./App.css";
import SideBar from "./components/navBar/SideBar";
import Landing from "./views/Landing/Landing";




function App() {

    const [isLoggedIn , setIsLoggedIn] = useState(false);
    const [verifyUser , setVerifyUser] = useState(false);
    const [loggedUser , setLoggedUser] = useState("");
    const handleLogin = () => {

      setIsLoggedIn(true);

    };

    const HandleVerifyUser = () => {

      setVerifyUser(true);

    };

    const handleLogout = () => {
      setIsLoggedIn(false);
      setVerifyUser(false);
      setLoggedUser("");
      localStorage.removeItem('loggedUser');
  };
  useEffect(() => {
    // Verificar si hay un usuario logueado en el almacenamiento local
    const user = localStorage.getItem("loggedUser");
  
  
    if (user) {
      setIsLoggedIn(true);
      setLoggedUser(user);
      setVerifyUser(true);
    } 
  }, [loggedUser]);

  return (
    <div className="App">
      {((loggedUser || verifyUser)&& isLoggedIn) ? (
        <SideBar onLogout={handleLogout} />
      ) : <Landing onLogin={handleLogin} HandleVerifyUser={HandleVerifyUser} />} 
  </div>
  );
}

export default App;