import { Modal as BaseModal } from "@mui/base/Modal";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import { createTheme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import { css, styled, ThemeProvider } from "@mui/system";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
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

  const { tenantId } = useSelector((state) => state.tenant);

  const [totalService, setTotalService] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [paid, setPaid] = useState({
    payment_day: dayjs().format("YYYY-MM-DD"),
    amount: "",
    depositAmount: 0,
    payment_mode: "",
    appointmentsId: [],
    completePayment: true,
  });
  const [paid2, setPaid2] = useState({
    payment_day: dayjs().format("YYYY-MM-DD"),
    amount: "",
    depositAmount: 0,
    payment_mode: "",
    appointmentsId: [],
    completePayment: true,
  });

  const [twoPaid, setTwoPaid] = useState(false);
  const [attended, setAttended] = useState(null);
  const [appointmentsToPay, setAppointmentsToPay] = useState([]);
  console.log('citas a pagar',appointmentsToPay);
  console.log('citas atendidas',attended);
  
  
  const eventRender = event.sort((a, b) => a.start - b.start);

  const handleTwoPaid = () => setTwoPaid(!twoPaid);

  const handleChangeDeposit = (e) =>
    setPaid((prev) => ({ ...prev, depositAmount: Number(e.target.value) }));

  const handleChangeDeposit2 = (e) =>
    setPaid2((prev) => ({ ...prev, depositAmount: Number(e.target.value) }));

  const handlePaidMethod = (e) =>
    setPaid((prev) => ({ ...prev, payment_mode: e.target.value }));

  const handlePaidMethod2 = (e) =>
    setPaid2((prev) => ({ ...prev, payment_mode: e.target.value }));

  useEffect(() => {
    if (event) calcCost(event);
  }, [event, appointmentsToPay]);

  useEffect(() => {
    if (eventRender && totalService) {
      const appointmentsNoPaid = event.filter((ev) => ev.status === false);
      const ids = appointmentsNoPaid.map((app) => app.idAppointment);
      setPaid((prev) => ({ ...prev, appointmentsId: ids }));
      setPaid2((prev) => ({ ...prev, appointmentsId: ids }));
    }
  }, [eventRender, totalService]);

  const calcCost = (event) => {
    let totalAmount = 0;
    let remainingAmount = 0;

    const filteredEvents =
      appointmentsToPay.length > 0
        ? event.filter((ev) => appointmentsToPay.includes(ev.idAppointment))
        : event;

    filteredEvents.forEach((element) => {
      totalAmount += Number(element.cost);

      let totalDeposit = 0;
      element.payments.forEach((pay) => {
        totalDeposit += Number(pay.depositAmount || 0);
      });

      if (element.status === false) {
        remainingAmount += Number(element.cost - totalDeposit);
      }
    });

    setTotalService(totalAmount);
    setRemaining(remainingAmount);
    setPaid((prev) => ({ ...prev, amount: totalAmount }));
    setPaid2((prev) => ({ ...prev, amount: totalAmount }));
  };

  const handlePay = async (e) => {
    e.preventDefault();

    const idsToPay =
      appointmentsToPay.length > 0
        ? appointmentsToPay
        : event.map((ev) => ev.idAppointment);

    const updatedPaid = { ...paid, appointmentsId: idsToPay, tenantId };
    const updatedPaid2 = { ...paid2, appointmentsId: idsToPay, tenantId };

    try {
      if (twoPaid) {
        await axios.post(`${urlApi}payment`, updatedPaid);
        await axios.post(`${urlApi}payment`, updatedPaid2);
      } else {
        await axios.post(`${urlApi}payment`, updatedPaid);
      }

      await paymentSuccess(eventSearch);
      closeModal();
    } catch (error) {
      alert("Error al procesar el pago: " + error.message);
    }
  };

  const handleAttendedChange = (idAppointment, value) =>
   // console.log('ejecutando handleattended');
    
    setAttended({ appointmentsId: [idAppointment], attended: value });

  const handleAttended = async () => {
    try {
      await axios.post(`${urlApi}payment`, {
        attended,
        tenantId,
      });
       await reloadTable();
      closeModal();
    } catch (error) {
      alert("Error al procesar el pago: " + error.message);
    }
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
      keepMounted
    >
      <ModalContent sx={{ width: "fit-content", height: 500 }}>
        <div style={{ height: "10%" }} className="header">
          <div
            style={{
              fontWeight: "bold",
              padding: "12px",
              color: `${colors.dell[950]}`,
              fontSize: "1rem",
            }}
          >
            {event && event[0] && event[0].nameClient}
          </div>
          <div
            style={{
              width: "100%",
              maxWidth: "500px",
              padding: "8px",
              margin: "8px auto",
              boxSizing: "border-box",
            }}
          >
            <article
              style={{
                fontSize: "0.65rem",
                textAlign: "justify",
                lineHeight: "1.4",
                margin: "0",
                color: `${colors.dell[950]}`,
              }}
            >
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
            }}
          >
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
            <>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyItems: "center",
                  alignItems: "center",
                }}
              >
                <label
                  style={{
                    fontSize: "10px",
                    marginBottom: "2px",
                    fontWeight: "bold",
                    color: `${colors.dell[950]}`,
                  }}
                >
                  Monto total
                </label>
                <p
                  style={{
                    fontSize: "22px",
                    fontWeight: "bold",
                    margin: 0,
                    color: `${colors.dell[800]}`,
                  }}
                >
                  $ {totalService}
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyItems: "center",
                  alignItems: "center",
                }}
              >
                <label
                  style={{
                    fontSize: "10px",
                    marginBottom: "2px",
                    fontWeight: "bold",
                    color: `${colors.dell[950]}`,
                  }}
                >
                  Saldo a pagar
                </label>
                <p
                  style={{
                    fontSize: "22px",
                    fontWeight: "bold",
                    margin: 0,
                    color: `${red[800]}`,
                  }}
                >
                  $ {remaining}
                </p>
              </div>

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
                      fontWeight: "bold",
                      fontSize: "12px",
                    },
                  }}
                />
              </ThemeProvider>

              <div
                style={{
                  display: "flex",
                  flexDirection: " row",
                  gap: "20px",
                  width: "40%",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: " column",
                    gap: "10px",
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: " row",
                      gap: "10px",
                      width: "100%",
                      alignItems: "center",
                    }}
                  >
                    <ThemeProvider theme={theme}>
                      <TextField
                        id="outlined-select-currency"
                        select
                        label="Método de pago"
                        defaultValue=""
                        style={{ width: "70%" }}
                        onChange={handlePaidMethod}
                        size="small"
                      >
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
                        type="number"
                        variant="outlined"
                        size="small"
                        value={paid.depositAmount}
                        onChange={handleChangeDeposit}
                        style={{ width: "40%" }}
                        inputProps={{
                          max: twoPaid ? remaining / 2 : remaining,
                          min: 0,
                          step: "any",
                        }}
                      />
                    </ThemeProvider>
                  </div>

                  {twoPaid && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: " row",
                        gap: "10px",
                        width: "100%",
                        alignItems: "center",
                      }}
                    >
                      <ThemeProvider theme={theme}>
                        <TextField
                          id="outlined-select-currency"
                          select
                          label="Método de pago"
                          defaultValue=""
                          style={{ width: "70%" }}
                          onChange={handlePaidMethod2}
                          size="small"
                        >
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
                          style={{ width: "40%" }}
                          inputProps={{
                            max: remaining / 2,
                            min: 0,
                            step: "any",
                          }}
                        />
                      </ThemeProvider>
                    </div>
                  )}
                </div>

                <TriggerButton
                  color="success"
                  size="small"
                  onClick={handlePay}
                  disabled={paid.payment_mode === ""}
                >
                  Pagar
                </TriggerButton>
              </div>
            </>
          )}
        </div>
      </ModalContent>
    </Modal>
  );
};

// ------------------- Estilos -------------------
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
      height: 20%;
    }

    .content {
      height: 60%;
    }

    .footer {
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      align-items: center;
      margin-top: 5px;
      height: 20%;
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
      background: #ccc;
      color: #666;
      cursor: not-allowed;
    }
  `
);

const CustomCheckboxLabel = styled(FormControlLabel)(
  ({ theme }) => css`
    font-family: "Roboto", sans-serif;
    font-size: 8px;
    color: ${theme.palette.mode === "dark" ? "#fff" : "#333"};
    margin-left: 8px;
  `
);

const theme = createTheme({
  palette: {
    success: {
      main: colors.dell[600],
    },
    primary: {
      main: colors.dell[600],
    },
  },
});

export default DetailAppointment;
