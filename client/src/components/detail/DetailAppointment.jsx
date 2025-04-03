import { Modal as BaseModal } from "@mui/base/Modal";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import { createTheme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import { css, display, styled, ThemeProvider, width } from "@mui/system";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { urlApi } from "../../assets/urlApi";
import GroupTable from "./GroupTable";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

const DetailAppointment = ({
  openModal,
  closeModal,
  event,
  eventSearch,
  setEventSelected,
  paymentSuccess,
  reloadTable,
}) => {
  const date = dayjs(event[0].start).format("DD/MM/YYYY");

  const [totalService, setTotalService] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [paid, setPaid] = useState({
    payment_day: dayjs().format("YYYY-MM-DD"),
    amount: "",
    payment_mode: "",
    appointmentsId: [],
    completePayment: true,
  });
  const [paid2, setPaid2] = useState({
    payment_day: dayjs().format("YYYY-MM-DD"),
    amount: "",
    payment_mode: "",
    appointmentsId: [],
    completePayment: true,
  });

  const dispatch = useDispatch();

  const eventRender = event.sort((a, b) => a.start - b.start);

  const [twoPaid, setTwoPaid] = useState(false);

  const [attended, setAttended] = useState(null);
  const [appointmentsToPay, setAppointmentsToPay] = useState([]);

  const handleTwoPaid = () => {
    setTwoPaid(!twoPaid); //esto lo usamos para marcar si el cliente es privado o no
  };

  const handleChangeDeposit = async (e) => {
    const seña = e.target.value;

    setPaid({ ...paid, depositAmount: seña });
    // setNewAppointment({ ...newAppointment, dni: dni });
    // validateInput("dni", { ...newAppointment, dni: dni });
  };

  const handleChangeDeposit2 = async (e) => {
    const seña = e.target.value;

    setPaid2({ ...paid2, depositAmount: seña });
    // setNewAppointment({ ...newAppointment, dni: dni });
    // validateInput("dni", { ...newAppointment, dni: dni });
  };

  useEffect(() => {
    if (event) {
      calcCost(event);
    }
  }, [event]);

  useEffect(() => {
    if (eventRender && totalService) {
      const appointmentsNoPaid = event.filter(
        (event) => event.status === false
      );
      const ids = appointmentsNoPaid.flatMap((app) => app.idAppointment);

      setPaid({ ...paid, appointmentsId: ids });
      setPaid2({ ...paid2, appointmentsId: ids });
    }
  }, [eventRender, totalService]);

  useEffect(() => {
    if (event) {
      const allPaid = event.every((element) => element.status === true);

      if (allPaid) {
        // Si todas las citas están pagadas, calcular el monto total
        const totalAmount = event.reduce(
          (total, element) => total + element.cost,
          0
        );
        setTotalService(totalAmount);
        setRemaining(0); // Ya no hay saldo a pagar
      } else {
        // Si no todas las citas están pagadas, recalcular el monto total y el saldo restante
        calcCost(event);
      }
    }
  }, [event, appointmentsToPay]);

  const calcCost = (event) => {
    let totalAmount = 0;
    let remainingAmount = 0;

    // Filtrar las citas que están en appointmentsToPay
    const filteredEvents = event.filter((element) =>
      appointmentsToPay.includes(element.idAppointment)
    );

    filteredEvents.forEach((element) => {
      totalAmount += Number(element.cost);

      let totalDeposit = 0;

      element.payments.forEach((pay) => {
        totalDeposit += pay.depositAmount;
      });

      if (element.status === false) {
        remainingAmount += Number(element.cost - (totalDeposit || 0));
      }
    });

    setTotalService(totalAmount);
    setRemaining(remainingAmount);
    setPaid({ ...paid, amount: totalAmount });
    setPaid2({ ...paid2, amount: totalAmount });
  };

  const handlePaidMethod = async (e) => {
    const modePaid = e.target.value;

    setPaid({ ...paid, payment_mode: modePaid });
  };

  const handlePaidMethod2 = async (e) => {
    const modePaid = e.target.value;

    setPaid2({ ...paid2, payment_mode: modePaid });
  };

  const handlePay = async (e) => {
    e.preventDefault();

    const updatedPaid = { ...paid, appointmentsId: appointmentsToPay };
    const updatedPaid2 = { ...paid2, appointmentsId: appointmentsToPay };

    try {
      if (twoPaid) {
      }
      const response = await axios.post(`${urlApi}payment`, updatedPaid);
      if (twoPaid) {
        const response = await axios.post(`${urlApi}payment`, updatedPaid2);
      }

      await paymentSuccess(eventSearch);
      closeModal();
    } catch (error) {
      throw alert("Error al procesar el pago:", error.message);
    }
  };

  const handleAttended = async (e) => {
    try {
      const response = await axios.post(`${urlApi}payment`, attended);

      // await paymentSuccess(eventSearch);
      closeModal();
    } catch (error) {
      throw alert("Error al procesar el pago:", error.message);
    }
  };

  const handleAttendedChange = (idAppointment, value) => {
    setAttended({ appointmentsId: [idAppointment], attended: value });
  };

  useEffect(() => {
    if (attended?.attended) handleAttended();
  }, [attended]);
  return (
    <Modal
      aria-labelledby="keep-mounted-modal-title"
      aria-describedby="keep-mounted-modal-description"
      open={openModal}
      onClose={closeModal}
      slots={{ backdrop: StyledBackdrop }}
      keepMounted>
      <ModalContent sx={{ width: "fit-content", height: 500 }}>
        <div style={{ height: "10%" }} className="header">
          <div
            style={{
              fontWeight: "bold",
              padding: "12px",
              color: `${colors.dell[950]}`,
              fontSize: "1rem",
            }}>
            {event && event[0] && event[0].nameClient}
          </div>
          <div
            style={{
              width: "100%",
              maxWidth: "500px",
              padding: "8px",
              margin: "8px auto",
              boxSizing: "border-box",
            }}>
            <article
              style={{
                fontSize: "0.65rem",
                textAlign: "justify",
                lineHeight: "1.4",
                margin: "0",
                color: `${colors.dell[950]}`,
              }}>
              <strong>Nota: </strong>En caso de no asistir al turno, modificar
              el costo del servicio al valor de la seña y confirmar la asistencia del turno
              para calcular comisión.
            </article>
          </div>

          <div
            style={{
              fontWeight: "bold",
              padding: "12px",
              color: `${colors.dell[950]}`,
              fontSize: "1rem",
            }}>
            {date}
          </div>
        </div>
        <Divider />

        <GroupTable
          className="content"
          style={{ height: "100%" }}
          event={eventRender}
          setEventSelected={setEventSelected}
          closeModal={closeModal}
          reloadTable={reloadTable}
          handleAttendedChange={handleAttendedChange}
          setAppointmentsToPay={setAppointmentsToPay}
        />

        <Divider />
        <div className="footer">
          {remaining !== 0 && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyItems: "center",
                alignItems: "center",
              }}>
              <label
                style={{
                  fontSize: "10px",
                  marginBottom: "2px",
                  fontWeight: "bold",
                  color: `${colors.dell[950]}`,
                }}>
                Monto total
              </label>
              <p
                style={{
                  fontSize: "22px",
                  fontWeight: "bold",
                  margin: 0,
                  color: `${colors.dell[800]}`,
                }}>
                $ {totalService}
              </p>
            </div>
          )}
          {remaining !== 0 && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyItems: "center",
                alignItems: "center",
              }}>
              <label
                style={{
                  fontSize: "10px",
                  marginBottom: "2px",
                  fontWeight: "bold",
                  color: `${colors.dell[950]}`,
                }}>
                Saldo a pagar
              </label>
              <p
                style={{
                  fontSize: "22px",
                  fontWeight: "bold",
                  margin: 0,
                  color: `${red[800]}`,
                }}>
                $ {remaining}
              </p>
            </div>
          )}
          {remaining !== 0 && (
            <ThemeProvider theme={theme}>
              <CustomCheckboxLabel
                control={
                  <Checkbox
                    size="small"
                    checked={twoPaid}
                    onChange={handleTwoPaid}
                    style={{ padding: "0", marginRight: "2px" }}
                  />
                }
                label="Dividir pago"
                sx={{
                  "& .MuiFormControlLabel-label": {
                    fontWeight: "bold", // Establece el peso de la fuente
                    fontSize: "12px",
                  },
                }}
              />
            </ThemeProvider>
          )}
          {remaining !== 0 && (
            <div
              style={{
                display: "flex",
                flexDirection: " row",
                gap: "20px",
                width: "40%",
                alignItems: "center",
              }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: " column",
                  gap: "10px",
                  width: "100%",
                }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: " row",
                    gap: "10px",
                    width: "100%",
                    alignItems: "center",
                  }}>
                  <ThemeProvider theme={theme}>
                    <TextField
                      id="outlined-select-currency"
                      select
                      label="Método de pago"
                      defaultValue=""
                      style={{ width: "70%" }}
                      onChange={handlePaidMethod}
                      size="small">
                      <MenuItem value="Efectivo">Efectivo</MenuItem>
                      <MenuItem value="Transferencia">Transferencia</MenuItem>
                      <MenuItem value="Débito">Débito</MenuItem>
                      <MenuItem value="Crédito">Crédito</MenuItem>
                    </TextField>
                  </ThemeProvider>
                  <ThemeProvider theme={theme}>
                    <TextField
                      id="seña"
                      label={`$ ${twoPaid ? remaining / 2 : remaining}`}
                      type="number" // Cambia a tipo número
                      variant="outlined"
                      size="small"
                      value={paid.depositAmount}
                      onChange={handleChangeDeposit}
                      style={{ width: "40%" }} // Ajusta el ancho según sea necesario
                      inputProps={{
                        max: twoPaid ? remaining / 2 : remaining, // Establece el valor máximo
                        min: 0, // Opcional: establece un valor mínimo si es necesario
                        step: "any", // Opcional: permite pasos fraccionarios
                      }}
                    />
                  </ThemeProvider>
                </div>
                {twoPaid ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: " row",
                      gap: "10px",
                      width: "100%",
                      alignItems: "center",
                    }}>
                    <ThemeProvider theme={theme}>
                      <TextField
                        id="outlined-select-currency"
                        select
                        label="Método de pago"
                        defaultValue=""
                        style={{ width: "70%" }}
                        onChange={handlePaidMethod2}
                        size="small">
                        <MenuItem value="Efectivo">Efectivo</MenuItem>
                        <MenuItem value="Transferencia">Transferencia</MenuItem>
                        <MenuItem value="Débito">Débito</MenuItem>
                        <MenuItem value="Crédito">Crédito</MenuItem>
                      </TextField>
                    </ThemeProvider>
                    <ThemeProvider theme={theme}>
                      <TextField
                        id="seña"
                        label={
                          paid.depositAmount > 0
                            ? `$ ${remaining - paid.depositAmount}`
                            : `$ ${remaining / 2}`
                        }
                        type="number"
                        variant="outlined"
                        size="small"
                        value={paid2.depositAmount}
                        onChange={handleChangeDeposit2}
                        style={{ width: "40%" }} // Ajusta el ancho según sea necesario
                        inputProps={{
                          max: remaining / 2,
                          min: 0, // Opcional: establece un valor mínimo si es necesario
                          step: "any", // Opcional: permite pasos fraccionarios
                        }}
                      />
                    </ThemeProvider>
                  </div>
                ) : null}
              </div>
              <TriggerButton
                // variant="contained"
                color="success"
                size="small"
                onClick={handlePay}
                disabled={paid.payment_mode === ""}>
                Pagar
              </TriggerButton>
            </div>
          )}
        </div>
      </ModalContent>
    </Modal>
  );
};

const Modal = styled(BaseModal)(
  ({ theme }) => css`
    position: fixed;
    z-index: 1300;
    right: 0;
    bottom: 0;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;

    &.base-Modal-hidden {
      visibility: hidden;
    }
  `
);

const StyledBackdrop = styled("div")(
  ({ theme }) => css`
    z-index: -1;
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    -webkit-tap-highlight-color: transparent;
  `
);

const ModalContent = styled("div")(
  ({ theme }) => css`
    font-family: "IBM Plex Sans", sans-serif;
    font-weight: 500;
    text-align: start;
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 8px;
    overflow: hidden;
    background-color: ${theme.palette.mode === "dark" ? "#1C2025" : "#fff"};
    border-radius: 8px;
    border: 1px solid ${theme.palette.mode === "dark" ? "#434D5B" : "#E5EAF2"};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    padding: 24px;
    color: ${theme.palette.mode === "dark" ? "#F3F6F9" : "#434D5B"};

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 20%; /* 20% de la altura del modal */
    }

    .content {
      // flex-grow: 1; /* Para expandir este contenedor y que ocupe todo el espacio disponible */
      // overflow-y: auto; /* Para agregar barras de desplazamiento vertical si el contenido excede el tamaño del contenedor */
      height: 60%; /* 60% de la altura del modal */
    }

    .footer {
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      align-items: center;
      margin-top: 5px;
      height: 20%; /* 20% de la altura del modal */
    }

    .modal-title {
      margin: 0;
      line-height: 1.5rem;
      margin-bottom: 8px;
    }
  `
);

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

const green = {
  50: "#E7F6E7",
  100: "#C2E6C1",
  200: "#9DD69D",
  300: "#78C778",
  400: "#52B752",
  500: "#2DA82D",
  600: "#279927",
  700: "#208B20",
  800: "#1A751A",
  900: "#145E14",
};

export default DetailAppointment;

const TriggerButton = styled("button")(
  ({ theme }) => css`
    font-family: "IBM Plex Sans", sans-serif;
    font-weight: 600;
    font-size: 0.875rem;
    line-height: 1.5;
    padding: 8px 16px;
    border-radius: 5px;
    transition: all 150ms ease;
    cursor: pointer;
    background: linear-gradient(to bottom, var(--dell-500), var(--dell-600));
    color: var(--dell-950);
    border: none;
    height: 45px;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);

    &:hover:not(:disabled) {
      background: linear-gradient(to bottom, var(--dell-600), var(--dell-700));
      border-color: ${theme.palette.mode === "dark" ? green[600] : green[300]};
      color: ${theme.palette.mode === "dark" ? green[600] : colors.dell[950]};
      box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    }

    &:active:not(:disabled) {
      background: ${theme.palette.mode === "dark" ? green[700] : green[300]};
    }

    &:focus-visible {
      box-shadow: 0 0 0 4px
        ${theme.palette.mode === "dark" ? green[300] : green[200]};
      outline: none;
    }

    &:disabled {
      // opacity: 0.5;
      background: #ccc;
      color: #666;
      cursor: not-allowed;
      // pointer-events: none; /* Desactivar eventos de puntero */
    }
  `
);

const CustomCheckboxLabel = styled(FormControlLabel)(
  ({ theme }) => css`
    font-family: "Roboto", sans-serif;
    font-size: 8px;
    color: ${theme.palette.mode === "dark"
      ? "#fff"
      : "#333"}; /* Example color based on theme mode */
    margin-left: 8px; /* Adjust margin as needed */
  `
);

const theme = createTheme({
  palette: {
    success: {
      main: colors.dell[600], // Cambia el color principal de éxito (success)
    },
    primary: {
      main: colors.dell[600],
    },
  },
});

const red = {
  50: "#FFEBEE",
  100: "#FFCDD2",
  200: "#EF9A9A",
  300: "#E57373",
  400: "#EF5350",
  500: "#F44336",
  600: "#E53935",
  700: "#D32F2F",
  800: "#C62828",
  900: "#B71C1C",
};
