import { useEffect, useState } from "react";

import dayjs from "dayjs";
import React from "react";
import LogoAdvertencia from "../../assets/LogoAdvertencia.png";
import CommissionsNavBar from "../../components/commissionsNavBar/commissionsNavBar";
import DashboardNavBar from "../../components/dashboardNavBar/dashboardNavBar";
import Commissions from "../Commissions/Commissions";
import Customers from "../Customers/Customers";
import NewCustomerForm from "../NewCustomerForm/NewCustomerForm";
import NewProfessionalForm from "../NewProfessionalForm/NewProfessionalForm";
import NewServiceForm from "../NewService/NewServiceForm";
import Professionals from "../profetionals/Professionals";
import Services from "../Services/Services";
import { css, fontWeight, styled } from "@mui/system";
import styles from "./Dashboard.module.css";
import { Divider } from "@mui/material";
import { jwtDecode } from 'jwt-decode';

const Dashboard = ({ drawerWidth, appHeight }) => {
  const [opcionSeleccionada, setOpcionSeleccionada] = useState("clientes");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDatePick, setSelectedDatePick] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState(null);

//const user = JSON.parse(localStorage.getItem("loggedUser"));
// const decodedUser = jwtDecode(localStorage.getItem("tokken"));
 // console.log('decodeduder',decodedUser);



 console.log(localStorage);
   const loggedUser = localStorage.getItem("loggedUser");
   console.log('user',loggedUser);
  
   const user = jwtDecode(loggedUser);
   console.log('decodeduser',user);
  
  const profesionalRol = user.role;


  const handleFilterChange = (event) => {
    setSelectedFilter(event.target.value);


  };

  const renderFilterCommissions = (selectedFilter, commissions) => {

    if (selectedFilter === "Liquidado") {
      return commissions.filter(commission => commission.paid === true);
    } else if (selectedFilter === "no-liquidado") {
      return commissions.filter(commission => commission.paid === false);
    } else {
      return commissions;
    }

  };

  const handleMonthChange = (event) => {

    setSelectedMonth(event.target.value)


  };

  const handleDateChange = (date) => {
    const newDate = dayjs(date, "YYYY-MM-DD").format("YYYY-MM-DD");
    setSelectedDate(newDate);
    setSelectedMonth("00")
    setSelectedDatePick(date)
  };

  const handleOpcionSeleccionada = (opcion) => {

    setOpcionSeleccionada(opcion);
  };

  const formatDate = (date) => {


    const newDate = dayjs(date, "YYYY-MM-DD").format("YYYY-MM-DD");

    return newDate;
  };



  useEffect(() => {
    const newdate = dayjs();
    const formatedDate = formatDate(newdate);
    setSelectedDatePick(newdate)

    setSelectedDate(formatedDate);
  }, []);

  const renderizarVista = () => {
    const ErrorModal = () => {
      return (
        <div
          className="modal-content"
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignContent: "center",
            justifyContent: "center",
          }}>
          <div>
            <img
              src={LogoAdvertencia}
              alt="Advertencia"
              style={{ width: "15%" }}
            />
            <p style={{ fontWeight: "bold", fontSize: "30px", margin: "0" }}>
              Acceso denegado
            </p>
            <p style={{ fontSize: "20px", margin: "0" }}>
              Solo personal autorizado
            </p>
          </div>
        </div>
      );
    };

    switch (opcionSeleccionada) {
      case "clientes":
        return <Customers />;
      case "servicios":
        return <Services />;
      case "profesionales":
        if (profesionalRol === "Master") {
          return <Professionals />;
        } else {
          return <ErrorModal />;
        }
      case "comisiones":
        if (profesionalRol === "Master") {
          return (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignContent: "center",
                justifyContent: "center",
                // border: "solid orange 3px",
                overflow: 'hidden',
              }}>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  height: 'fit-content',
                  justifyContent: 'center',
                }}>
                <CommissionsNavBar
                  selectedDate={selectedDatePick}
                  onDateChange={handleDateChange}
                  onMonthChange={handleMonthChange}
                  selectedFilter={selectedFilter}
                  selectedMonth={selectedMonth}
                  onFilterChange={handleFilterChange}
                />
                <CustomDivider/>
              </div>
              <div style={{
                display: 'flex', height: '100%', overflowX: 'hidden', overflowY: 'scroll'
                // border:'solid blue 3px'
              }}>
               
                <Commissions
                  selectedDate={selectedDate}
                  selectedMonth={selectedMonth}
                  selectedFilter={selectedFilter}
                  setSelectedFilter={setSelectedFilter}
                  renderFilterCommissions={renderFilterCommissions}
                />
              </div>
            </div>
          );
        } else {
          return (
            <ErrorModal
              style={{ width: "100%", height: "100%", display: "flex" }}
            />
          );
        }
      case "agregar_cliente":
        return <NewCustomerForm style={{ marginTop: "20px" }} />;
      case "agregar_servicio":
        return <NewServiceForm />;
      case "agregar_profesional":
        return <NewProfessionalForm />;
      default:
        return <Customers />;
    }
  };

  return (
    <div className={styles.blueContainer}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          height: "50px",
        }}>
        <DashboardNavBar
          onOpcionSeleccionada={handleOpcionSeleccionada}
          optionSelected={opcionSeleccionada}
        />
      </div>
      <div id="renderVista" className={styles.dashboardContent}>
        {renderizarVista()}
      </div>
    </div>
  );
};

export default Dashboard;

const colors = {
  dell: {
    50: "#f1fce9",
    100: "#e0f8cf",
    200: "#c2f2a4",
    300: "#9ae86e",
    400: "#77d942",
    500: "#57bf23",
    600: "#409818",
    700: "#337417",
    800: "#2e6119",
    900: "#284e19",
    950: "#112b08",
  },
  codGray: {
    50: "#f7f7f6",
    100: "#e5e4e2",
    200: "#cac9c5",
    300: "#a8a7a0",
    400: "#85847c",
    500: "#6b6a61",
    600: "#54544d",
    700: "#454540",
    800: "#3a3935",
    900: "#32322f",
    930: "#161F1D",
    950: "#0b0b0a",
  },
};


const CustomDivider = styled(Divider)({
  borderColor:`${colors.codGray[950]}`, 
  border:"solid 1px"
});
