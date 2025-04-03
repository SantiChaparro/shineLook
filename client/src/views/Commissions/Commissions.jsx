import {
  Box,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { css, fontWeight, styled } from "@mui/system";
import axios from "axios";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import commissionsPerProfessional from "../../assets/functions/commissionsPerProfessional";
import { urlApi } from "../../assets/urlApi";
import CommissionDetail from "../../components/Commisiondetail/CommissionDetail";
import "./Commissions.css";

const Commissions = ({
  selectedDate,
  selectedMonth,
  selectedFilter,
  setSelectedFilter,
  renderFilterCommissions,
}) => {
  const [commissions, setCommissions] = useState([]);
  const [totalToRender, setTotalTorender] = useState([]);
  const [totalToRenderProfessional, setTotalTorenderProfessional] = useState(
    []
  );
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalCash, setTotalCash] = useState(0);
  const [totalOthers, setTotalOthers] = useState(0);
  const [totalBendahan, setTotalBendahan] = useState(0);
  const [selectedCommission, setSelectedCommission] = useState(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [totalDiario, setTotalDiario] = useState(0);

  useEffect(() => {
    if (selectedMonth) {
      handleMonthCommissions();
      setSelectedFilter("");
    }
  }, [selectedMonth]);

  useEffect(() => {}, [totalToRenderProfessional, totalToRender]);

  useEffect(() => {
    const dateData = { date: selectedDate };

   

    const fetchingCommissions = async () => {
      const resp = await axios.post(`${urlApi}commission`, dateData);
   

      // Filtrar el array resp.data en dos arrays separados
      const withProfessional = resp.data.filter((item) => item.Professional);
      const withoutProfessional = resp.data.filter(
        (item) => !item.Professional
      );

      setCommissions(withProfessional);
      setTotalTorender(commissionsPerProfessional(withProfessional));
      setTotalTorenderProfessional(withoutProfessional);

      // Sumar los resultados de calcTotals y calcTotalsWithoutProffesional
      const totalsWithProfessional = calcTotals(withProfessional);
      const totalsWithoutProfessional =
        calcTotalsWithoutProffesional(withoutProfessional);

      // Sumar los totales
      const combinedTotal =
        totalsWithProfessional.total + totalsWithoutProfessional.total;
      const combinedEfectivoAmount =
        totalsWithProfessional.efectivoAmount +
        totalsWithoutProfessional.efectivoAmount;
      const combinedOtherAmount =
        totalsWithProfessional.otherAmount +
        totalsWithoutProfessional.otherAmount;

      // Actualizar el estado con los valores combinados
      setTotalAmount(combinedTotal);
      setTotalCash(combinedEfectivoAmount);
      setTotalOthers(combinedOtherAmount);
      calcTotalBendahan(combinedTotal, totalDiario);
    };

    fetchingCommissions();
  }, [selectedDate]);

  useEffect(() => {
    if (selectedFilter) {
      const filtered = renderFilterCommissions(selectedFilter, commissions);
      setTotalTorender(commissionsPerProfessional(filtered));

      const totalsWithProfessional = calcTotals(filtered);
      const combinedTotal = totalsWithProfessional.total;
      const combinedEfectivoAmount = totalsWithProfessional.efectivoAmount;
      const combinedOtherAmount = totalsWithProfessional.otherAmount;

      setTotalAmount(combinedTotal);
      setTotalCash(combinedEfectivoAmount);
      setTotalOthers(combinedOtherAmount);
      calcTotalBendahan(combinedTotal, totalDiario);
    }
  }, [selectedFilter, renderFilterCommissions]);

  const handleMonthCommissions = async () => {
    const resp = await axios.get(`${urlApi}commission`);

    if (resp.data) {
      const totalCommissions = resp.data;
      const commissionsPerMonth = totalCommissions.filter((commission) => {
        const month = commission.date.split("-");
        return month[1] === selectedMonth;
      });

      // Separate commissions with and without professionals
      const withProfessional = commissionsPerMonth.filter(
        (item) => item.Professional
      );
      const withoutProfessional = commissionsPerMonth.filter(
        (item) => !item.Professional
      );

      // Set commissions with professionals
      setCommissions(withProfessional);
      setTotalTorender(commissionsPerProfessional(withProfessional));
     

      setTotalTorenderProfessional(withoutProfessional);

      // Calculate totals for commissions with professionals
      const totalsPerProfessional = calcTotals(withProfessional);
      const totalWithProfessional = totalsPerProfessional.total;
      const efectivoWithProfessional = totalsPerProfessional.efectivoAmount;
      const othersWithProfessional = totalsPerProfessional.otherAmount;

      // Calculate totals for commissions without professionals
      const totalsWithoutProfessional =
        calcTotalsWithoutProffesional(withoutProfessional);
      const totalWithoutProfessional = totalsWithoutProfessional.total;
      const efectivoWithoutProfessional =
        totalsWithoutProfessional.efectivoAmount;
      const othersWithoutProfessional = totalsWithoutProfessional.otherAmount;

      // Sum totals from both calculations
      const combinedTotal = totalWithProfessional + totalWithoutProfessional;
      const combinedEfectivoAmount =
        efectivoWithProfessional + efectivoWithoutProfessional;
      const combinedOtherAmount =
        othersWithProfessional + othersWithoutProfessional;

      // Set the combined totals
      setTotalAmount(combinedTotal);
      setTotalCash(combinedEfectivoAmount);
      setTotalOthers(combinedOtherAmount);

      // Calculate total Bendahan
      calcTotalBendahan(combinedTotal, totalDiario);
    }
  };

  const formatDate = (date) => {
    return dayjs(date, "YYYY-MM-DD").format("YYYY-MM-DD");
  };

  const handleDetail = (dni) => {
    const filteredCommissions = commissions.filter(
      (commission) => commission.Professional.dni === dni
    );
    setSelectedCommission(filteredCommissions);
    setOpenDetail(true);
  };

  const onClose = () => {
    setOpenDetail(false);
  };

  const dailyCommissions = (totalToRender) => {
    const values = Object.values(totalToRender).map((item) => item.total);
    const total = values.reduce((total, amount) => total + amount, 0);
    setTotalDiario(total);
    calcTotalBendahan(totalAmount, total);
  };

  const handlePayout = async (id) => {
    const resp = await axios.patch(`${urlApi}commission/${id}`);

    const updatedCommissions = commissions.map((commission) => {
      if (commission.id === id) {
        return { ...commission, paid: true };
      }
      return commission;
    });
    setCommissions(updatedCommissions);

    if (selectedCommission) {
      const updatedSelectedCommissions = selectedCommission.map(
        (commission) => {
          if (commission.id === id) {
            return { ...commission, paid: true };
          }
          return commission;
        }
      );
      setSelectedCommission(updatedSelectedCommissions);
    }
  };

  const calcTotals = (commissions) => {
    let total = 0;
    let efectivoAmount = 0;
    let otherAmount = 0;

    if (commissions && commissions.length > 0) {
      commissions.forEach((commission) => {
        total += commission.Appointment.Payments[0].amount;

        const appointment = commission.Appointment;
        if (
          appointment &&
          appointment.Payments &&
          appointment.Payments.length > 0
        ) {
          appointment.Payments.forEach((payment) => {
            if (payment.payment_mode === "Efectivo") {
              efectivoAmount += payment.depositAmount;
            } else {
              otherAmount += payment.depositAmount;
            }
          });
        }
      });
    }

    return { total, efectivoAmount, otherAmount };
  };

  const calcTotalsWithoutProffesional = (commissions) => {
    let total = 0;
    let efectivoAmount = 0;
    let otherAmount = 0;

    if (commissions && commissions.length > 0) {
      commissions.forEach((commission) => {
        const appointment = commission.Appointment;
        if (
          appointment &&
          appointment.Payments &&
          appointment.Payments.length > 0
        ) {
          appointment.Payments.forEach((payment) => {
            if (payment.payment_mode === "Efectivo") {
              efectivoAmount += payment.depositAmount;
            } else {
              otherAmount += payment.depositAmount;
            }
            total += payment.depositAmount;
          });
        }
      });
    }

    return { total, efectivoAmount, otherAmount };
  };

  const calcTotalBendahan = (totalAmount, totalDiario) => {
    const total = totalAmount - totalDiario;
    setTotalBendahan(total);
  };

  useEffect(() => {
    if (Object.keys(totalToRender).length > 0) {
      dailyCommissions(totalToRender);
    }
  }, [totalToRender]);

  useEffect(() => {
    localStorage.setItem(
      "liquidatedCommissions",
      JSON.stringify(commissions.filter((commission) => commission.paid))
    );
  }, [commissions]);

  useEffect(() => {
    const storedLiquidatedCommissions = JSON.parse(
      localStorage.getItem("liquidatedCommissions")
    );
    if (storedLiquidatedCommissions) {
      const updatedCommissions = commissions.map((commission) => {
        if (
          storedLiquidatedCommissions.some(
            (storedCommission) => storedCommission.id === commission.id
          )
        ) {
          return { ...commission, paid: true };
        }
        return commission;
      });
      setCommissions(updatedCommissions);
    }
  }, []);


  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignContent: "start",
        width: "100%",
        overflow: "hidden",
      }}>
      {openDetail ? (
        <CommissionDetail
          selectedCommission={selectedCommission}
          onClose={onClose}
          handlePayout={handlePayout}
        />
      ) : (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignContent: "start",
          }}>
          {Object.keys(totalToRender).length === 0 &&
          Object.keys(totalToRenderProfessional).length === 0 ? (
            <StyledInputLabel>No hay comisiones registradas</StyledInputLabel>
          ) : (
            <Box sx={{ height: "100%", overflow: "hidden" }}>
              <TableContainer sx={{ width: "100%", height: "90%" }}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      <TableCell class="cellHead" align="center">
                        Nombre
                      </TableCell>
                      <TableCell class="cellHead" align="center">
                        Dni
                      </TableCell>
                      <TableCell class="cellHead" align="center">
                        Total comisión
                      </TableCell>
                      <TableCell class="cellHead" align="center">
                        Acciones
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody sx={{ overflow: "hidden" }}>
                    {Object.entries(totalToRender).map(
                      ([name, { total, dni }]) => (
                        <TableRow key={name}>
                          <TableCell class="cellBody" align="center">
                            {name}
                          </TableCell>
                          <TableCell class="cellBody" align="center">
                            {dni}
                          </TableCell>
                          <TableCell
                            class="cellBody"
                            align="center">{`$ ${total}`}</TableCell>
                          <TableCell class="cellBody" align="center">
                            <TriggerButton
                              onClick={() =>
                                handleDetail(
                                  commissions.find(
                                    (commission) =>
                                      commission.Professional?.name === name
                                  ).Professional?.dni
                                )
                              }>
                              Detalle
                            </TriggerButton>
                          </TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* <CustomDivider />

              <TableContainer sx={{ width: "100%", height: "40%" }}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableCell class="cellTitle" colSpan={13} align="center">
                      No Asistidos
                    </TableCell>
                    <TableRow>
                      <TableCell class="cellHead" align="center"></TableCell>
                      <TableCell class="cellHead" align="center"></TableCell>
                      <TableCell class="cellHead" align="center"></TableCell>
                      <TableCell class="cellHead" align="center"></TableCell>
                      <TableCell class="cellHead" align="center">
                        Fecha
                      </TableCell>
                      <TableCell class="cellHead" align="center">
                        Profesional
                      </TableCell>
                      <TableCell class="cellHead" align="center">
                        Cliente
                      </TableCell>

                      <TableCell class="cellHead" align="center">
                        Total
                      </TableCell>
                      <TableCell class="cellHead" align="center"></TableCell>
                      <TableCell class="cellHead" align="center">
                        {" "}
                      </TableCell>
                      <TableCell class="cellHead" align="center">
                        {" "}
                      </TableCell>
                      <TableCell class="cellHead" align="center">
                        {" "}
                      </TableCell>
                      <TableCell class="cellHead" align="center">
                        {" "}
                      </TableCell>
                      <TableCell class="cellHead" align="center">
                        {" "}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody sx={{ overflow: "hidden" }}>
                    {Object.entries(totalToRenderProfessional).map(
                      ([name, { total, dni, Appointment }]) => (
                        <TableRow key={name}>
                          <TableCell
                            class="cellBody"
                            align="center"></TableCell>
                          <TableCell
                            class="cellBody"
                            align="center"></TableCell>
                          <TableCell
                            class="cellBody"
                            align="center"></TableCell>
                          <TableCell
                            class="cellBody"
                            align="center"></TableCell>
                          <TableCell class="cellBody" align="center">
                            {dayjs(Appointment.date, "YYYY-MM-DD").format(
                              "DD-MM-YYYY"
                            )}
                          </TableCell>
                          <TableCell class="cellBody" align="center">
                            {Appointment?.Professional?.name}
                          </TableCell>
                          <TableCell class="cellBody" align="center">
                            {Appointment?.Client.name}
                          </TableCell>
                          <TableCell class="cellBody" align="center">
                            {Appointment && Appointment.Payments
                              ? `$ ${Appointment.Payments.reduce(
                                  (acc, payment) => acc + payment.depositAmount,
                                  0
                                )}`
                              : 0}
                          </TableCell>
                          <TableCell
                            class="cellBody"
                            align="center"></TableCell>
                          <TableCell
                            class="cellBody"
                            align="center"></TableCell>
                          <TableCell
                            class="cellBody"
                            align="center"></TableCell>
                          <TableCell
                            class="cellBody"
                            align="center"></TableCell>
                          <TableCell
                            class="cellBody"
                            align="center"></TableCell>
                          <TableCell
                            class="cellBody"
                            align="center"></TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              </TableContainer> */}

              <CustomDivider />

              <div
                style={{
                  width: "100%",
                  justifyContent: "space-evenly",
                  gap: "10px",
                  height: "10%",
                  alignContent: "baseline",
                  alignItems: "center",
                  display: "flex",
                  flexDirection: "row",
                }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "5px",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                  <StyledInputLabel
                    style={{
                      color: `${colors.dell[950]}`,
                      marginTop: "0",
                      alignContent: "center",
                      height: "100%",
                    }}>
                    Total
                  </StyledInputLabel>
                  <Typography
                    sx={{
                      height: "100%",
                      alignContent: "center",
                      fontSize: "26px",
                      fontWeight: "bold",
                      color: `${colors.dell[950]}`,
                    }}>
                    {" "}
                    {`$${Math.round(totalAmount * 100) / 100}`}
                  </Typography>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "5px",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                  <StyledInputLabel
                    style={{
                      color: `${colors.dell[950]}`,
                      marginTop: "0",
                      alignContent: "center",
                      height: "100%",
                    }}>
                    Efectivo
                  </StyledInputLabel>
                  <Typography
                    sx={{
                      height: "100%",
                      alignContent: "center",
                      fontSize: "26px",
                      fontWeight: "bold",
                      color: `${colors.dell[950]}`,
                    }}>
                    {" "}
                    {`$${Math.round(totalCash * 100) / 100}`}
                  </Typography>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "5px",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                  <StyledInputLabel
                    style={{
                      color: `${colors.dell[950]}`,
                      marginTop: "0",
                      alignContent: "center",
                      height: "100%",
                    }}>
                    Debito/Transferencia/Credito
                  </StyledInputLabel>
                  <Typography
                    sx={{
                      height: "100%",
                      alignContent: "center",
                      fontSize: "26px",
                      fontWeight: "bold",
                      color: `${colors.dell[950]}`,
                    }}>
                    {" "}
                    {`$${Math.round(totalOthers * 100) / 100}`}
                  </Typography>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "5px",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                  <StyledInputLabel
                    style={{
                      color: `${colors.dell[950]}`,
                      marginTop: "0",
                      alignContent: "center",
                      height: "100%",
                    }}>
                    Empleados
                  </StyledInputLabel>
                  <Typography
                    sx={{
                      height: "100%",
                      alignContent: "center",
                      fontSize: "26px",
                      fontWeight: "bold",
                      color: `${colors.dell[950]}`,
                    }}>
                    {" "}
                    {`$${Math.round(totalDiario * 100) / 100}`}
                  </Typography>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "5px",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                  <StyledInputLabel
                    style={{
                      color: `${colors.dell[950]}`,
                      marginTop: "0",
                      alignContent: "center",
                      height: "100%",
                    }}>
                    Bendahan
                  </StyledInputLabel>
                  <Typography
                    sx={{
                      height: "100%",
                      alignContent: "center",
                      fontSize: "26px",
                      fontWeight: "bold",
                      color: `${colors.dell[950]}`,
                    }}>
                    {" "}
                    {`$${totalBendahan}`}
                  </Typography>
                </div>
              </div>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default Commissions;

const StyledInputLabel = styled("span")({
  color: "rgba(0, 0, 0, 0.54)", // Color de texto del label de MUI
  fontFamily: "Roboto, Helvetica, Arial, sans-serif", // Fuente del label de MUI
  fontSize: "0.9rem", // Tamaño de fuente del label de MUI
  fontWeight: 400, // Peso de fuente del label de MUI
  lineHeight: 1, // Altura de línea del label de MUI
  letterSpacing: "0.00938em", // Espaciado de letras del label de MUI
  marginTop: "8px", // Espaciado superior del label de MUI
});

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
  borderColor: `${colors.codGray[950]}`,
  border: "solid 1px",
});

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
