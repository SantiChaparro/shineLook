import {
  Dialog,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { Box, css, styled } from "@mui/system";
import dayjs from "dayjs";
import React from "react";
import './CommissionDetail.css';

const CommissionDetail = ({ selectedCommission, onClose, handlePayout }) => {
  const handleOK = () => {
    onClose();
  };

  // Verificar si existen ambas categorías
  const hasHairdressing = selectedCommission.some(
    (commission) => commission.category === "Peluquería"
  );
  const hasEsthetic = selectedCommission.some(
    (commission) => commission.category === "Estética"
  );

  const { Professional } = selectedCommission[0];


  // Filtrar las comisiones por categoría y calcular el subtotal y total de comisiones y costos
  const calculateTotals = (commissions) => {


    const totalCommissions = commissions.reduce(
      (total, commission) => total + commission.amount,
      0
    );
    const totalCosts = commissions.reduce(
      (total, commission) => total + commission.Appointment.Payments[0].amount,
      0
    );

    let efectivoAmount = 0;
    let otherAmount = 0;

    commissions.forEach((commission) => {
      const appointment = commission.Appointment;

      if (appointment && appointment.Payments && appointment.Payments.length > 0) {
        appointment.Payments.forEach((payment) => {
          if (payment.payment_mode === 'Efectivo') {
            efectivoAmount += payment.depositAmount;
          } else {
            otherAmount += payment.depositAmount;
          }
        });
      }
    });

    const bendahanCommission = (totalCosts - totalCommissions).toFixed(2);

    return {
      totalCommissions,
      totalCosts,
      bendahanCommission,
      efectivoAmount,
      otherAmount
    };
  };

  const hairdressingCommissions = selectedCommission.filter(
    (commission) => commission.category === "Peluquería"
  );

  const {
    totalCommissions: hairdressingTotalCommissions,
    totalCosts: hairdressingTotalCosts,
    bendahanCommission: hairdressingBendahanCommission,
    efectivoAmount: hairdresstotalEfectivo,
    otherAmount: hairdresstotalOthers,
  } = calculateTotals(hairdressingCommissions);


  const estheticCommissions = selectedCommission.filter(
    (commission) => commission.category === "Estética"
  );

  const {
    totalCommissions: estheticTotalCommissions,
    totalCosts: estheticTotalCosts,
    bendahanCommission: estheticBendahanCommission,
    efectivoAmount: esthetictotalEfectivo,
    otherAmount: esthetictotalOthers,
  } = calculateTotals(estheticCommissions);


  const formatDate = (date) => {
    return dayjs(date).format("DD-MM-YYYY");
  };

  return (
    <Dialog
      open={true}
      maxWidth="lg"
      sx={{ "& .MuiDialog-paper": { width: "100%" } }}>
      <DialogTitle align="center" sx={{ fontWeight: 'bold', color: `${colors.dell[950]}`, fontSize: "1.2rem", }}>
        {Professional.name} - {Professional.dni}
        <CancelButton
          onClick={handleOK}
          style={{
            position: "absolute",
            right: 8,
            top: 4,
          }}>
          Cerrar
        </CancelButton>
      </DialogTitle>
      <DialogContent sx={{ overflowY: "auto", maxHeight: "70vh" }}>
        {hasHairdressing && (
          <>
            <Typography variant="h6" align="center" sx={{ marginTop: 2, fontWeight: 'bold', color: `${colors.dell[950]}`, fontSize: "1rem", }}>
              Peluqueria
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', color: `${colors.dell[950]}`, fontSize: "0.82rem", }} align="center">Fecha</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: `${colors.dell[950]}`, fontSize: "0.82rem", }} align="center">Servicio</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: `${colors.dell[950]}`, fontSize: "0.82rem", }} align="center">Costo</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: `${colors.dell[950]}`, fontSize: "0.82rem", }} align="center">Comisión Empleado</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: `${colors.dell[950]}`, fontSize: "0.82rem", }} align="center">Comisión Bendahan</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: `${colors.dell[950]}`, fontSize: "0.82rem", }} align="center">Pagado</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: `${colors.dell[950]}`, fontSize: "0.82rem", }} align="center"></TableCell>

                </TableRow>
              </TableHead>
              <TableBody>
                {hairdressingCommissions.map((commission) => (
                  <TableRow key={commission.Professional.dni}>
                    <TableCell align="center">
                      {formatDate(commission.date)}
                    </TableCell>
                    <TableCell align="center">
                      {commission.Service.service_name}
                    </TableCell>
                    <TableCell align="center">
                      {`$ ${commission.Appointment.Payments[0].amount}`}
                    </TableCell>
                    <TableCell align="center">{`$ ${commission.amount}`}</TableCell>
                    <TableCell align="center">
                      {`$ ${Math.round(
                        (commission.Appointment.Payments[0].amount - commission.amount) * 100
                      ) / 100}`}
                    </TableCell>
                    <TableCell align="center">
                      {commission.paid === true ? "Si" : "No"}
                    </TableCell>
                    <TableCell align="center">
                      {commission.paid === false ? (
                        <TriggerButton
                          onClick={() =>
                            handlePayout(commission.id)
                          }>
                          Pagar
                        </TriggerButton>
                      ) : null}
                    </TableCell>
                  </TableRow>
                ))}
                {/* Agregar subtotal de Peluquería */}
                <TableRow>
                  <TableCell align="center">
                    <Typography sx={{ fontWeight: 'bold', color: `${colors.dell[950]}`, fontSize: "1.2rem", }} variant="h6">
                      <b>Subtotal</b>
                    </Typography>
                  </TableCell>
                  <TableCell align="center"></TableCell>
                  <TableCell align="center">  <Typography sx={{ fontWeight: 'bold', color: `${colors.dell[950]}`, fontSize: "1.2rem", }} variant="h6">
                    <b>{`$ ${Math.round(hairdressingTotalCosts * 100) / 100}`}</b>
                  </Typography></TableCell>
                  <TableCell align="center">
                    <Typography sx={{ fontWeight: 'bold', color: `${colors.dell[950]}`, fontSize: "1.2rem", }} variant="h6">
                      <b>
                        {`$ ${Math.round(hairdressingTotalCommissions * 100) / 100}`}
                      </b>
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography sx={{ fontWeight: 'bold', color: `${colors.dell[950]}`, fontSize: "1.2rem", }} variant="h6">
                      <b>
                        {`$ ${Math.round(hairdressingBendahanCommission * 100) / 100}`}
                      </b>
                    </Typography>
                  </TableCell>
                  <TableCell align="center"></TableCell>
                  <TableCell align="center"></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </>
        )}
        {hasEsthetic && (
          <>
            <Typography variant="h6" align="center" sx={{ marginTop: 5, fontWeight: 'bold', color: `${colors.dell[950]}`, fontSize: "1rem", }}>
              Estética
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', color: `${colors.dell[950]}`, fontSize: "0.82rem", }} align="center">Fecha</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: `${colors.dell[950]}`, fontSize: "0.82rem", }} align="center">Servicio</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: `${colors.dell[950]}`, fontSize: "0.82rem", }} align="center">Costo</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: `${colors.dell[950]}`, fontSize: "0.82rem", }} align="center">Comisión Empleado</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: `${colors.dell[950]}`, fontSize: "0.82rem", }} align="center">Comisión Bendahan</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: `${colors.dell[950]}`, fontSize: "0.82rem", }} align="center">Pagado</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: `${colors.dell[950]}`, fontSize: "0.82rem", }} align="center"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {estheticCommissions.map((commission) => (
                  <TableRow key={commission.Professional.dni}>
                    <TableCell align="center">
                      {formatDate(commission.date)}
                    </TableCell>
                    <TableCell align="center">
                      {commission.Service.service_name}
                    </TableCell>
                    <TableCell align="center">
                    {`$ ${commission.Appointment.Payments[0].amount}`}
                    </TableCell>
                    <TableCell align="center">{`$ ${commission.amount}`}</TableCell>
                    <TableCell align="center">
                      {`$ ${Math.round(
                        (commission.Appointment.Payments[0].amount - commission.amount) * 100
                      ) / 100}`}
                    </TableCell>
                    <TableCell align="center">
                      {commission.paid === true ? "Si" : "No"}
                    </TableCell>
                    <TableCell align="center">
                      {commission.paid === false ? (
                        <TriggerButton
                          variant="contained"
                          color="primary"
                          onClick={() =>
                            handlePayout(commission.id)
                          }>
                          Pagar
                        </TriggerButton>
                      ) : null}
                    </TableCell>
                  </TableRow>
                ))}
                {/* Agregar subtotal de Estética */}
                <TableRow>
                  <TableCell align="center">
                    <Typography sx={{ fontWeight: 'bold', color: `${colors.dell[950]}`, fontSize: "1.2rem", }} variant="h6">
                      <b>Subtotal</b>
                    </Typography>
                  </TableCell>
                  <TableCell align="center">  </TableCell>
                  <TableCell align="center">
                    <Typography sx={{ fontWeight: 'bold', color: `${colors.dell[950]}`, fontSize: "1.2rem", }} variant="h6">
                      <b>{`$ ${Math.round(estheticTotalCosts * 100) / 100}`}</b>
                    </Typography>
                  </TableCell>

                  <TableCell align="center">
                    <Typography sx={{ fontWeight: 'bold', color: `${colors.dell[950]}`, fontSize: "1.2rem", }} variant="h6">
                      <b>{`$ ${Math.round(estheticTotalCommissions * 100) / 100}`}</b>
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography sx={{ fontWeight: 'bold', color: `${colors.dell[950]}`, fontSize: "1.2rem", }} variant="h6">
                      <b>
                        {`$ ${Math.round(estheticBendahanCommission * 100) / 100}`}
                      </b>
                    </Typography>
                  </TableCell>
                  <TableCell align="center"></TableCell>
                  <TableCell align="center"></TableCell>
                </TableRow>

              </TableBody>
            </Table>

          </>
        )}
        <Box sx={{ width: '100%', display: 'flex', gap: '70px', paddingLeft: '39px', paddingRigth: '39px', paddingTop: '20px', justifyContent: 'space-between', borderTop: 'solid 2px ', }} >
          <Typography sx={{ fontWeight: 'bold', color: `${colors.dell[950]}`, fontSize: "1.2rem", }} variant="h6">
            <b>Ingresos </b>
          </Typography>
          <Box sx={{ display: 'flex', gap: '12px', alignItems:"center" }}>
            <Typography sx={{ fontWeight: 'bold', color: `${colors.dell[950]}`, fontSize: "0.9rem", }} variant="h6">
              <b>Total</b>
            </Typography>
            <Typography sx={{ color: `${colors.dell[950]}`, fontSize: "1.3rem", }} variant="h6">
              <b>${estheticTotalCosts + hairdressingTotalCosts}</b>
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: '12px', alignItems:"center" }}>
          <Typography sx={{ fontWeight: 'bold', color: `${colors.dell[950]}`, fontSize: "0.9rem", }} variant="h6">
              <b>Efectivo</b>
            </Typography>
            <Typography sx={{ color: `${colors.dell[950]}`, fontSize: "1.3rem", }} variant="h6">
              <b>${esthetictotalEfectivo + hairdresstotalEfectivo}</b>
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: '12px', alignItems:"center" }}>
            <Typography sx={{ fontWeight: 'bold', color: `${colors.dell[950]}`, fontSize: "0.9rem", }} variant="h6">
              <b>Debito/Transferencia/Credito</b>
            </Typography>
            <Typography sx={{ fontWeight: 'bold', color: `${colors.dell[950]}`, fontSize: "1.3rem", }} variant="h6">
              <b>${esthetictotalOthers + hairdresstotalOthers}</b>
            </Typography>

          </Box>
        </Box>
      </DialogContent>
    </Dialog >
  );
};

export default CommissionDetail;

const blue = {
  100: "#CCE6FF",
  200: "#99CCFF",
  300: "#66B2FF",
  400: "#3399FF",
  500: "#007FFF",
  600: "#0072E5",
  700: "#0066CC",
  800: "#005AB2",
  900: "#004D99",
};

const grey = {
  50: "#F3F6F9",
  100: "#E5EAF2",
  200: "#DAE2ED",
  300: "#C7D0DD",
  400: "#B0B8C4",
  500: "#9DA8B7",
  600: "#6B7A90",
  700: "#434D5B",
  800: "#303740",
  900: "#1C2025",
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

const dell = {
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
};

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
      color: ${theme.palette.mode === "dark" ? green[600] : dell[950]};
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

const CancelButton = styled("button")(
  ({ theme }) => css`
      font-family: "IBM Plex Sans", sans-serif;
      font-weight: 600;
      font-size: 0.875rem;
      line-height: 1.5;
      padding: 8px 16px;
      border-radius: 5px;
      transition: all 150ms ease;
      cursor: pointer;
      border: 1px solid transparent; /* Borde transparente */
      background-color: transparent; /* Fondo transparente */
      color: var(--color-codGray-950); /* Color de texto */
  
      &:hover:not(:disabled) {
        color: ${red[900]}; /* Cambia el color al hacer hover */
      }
  
      &:active:not(:disabled) {
        color: ${red[900]}; /* Cambia el color al activar (click) */
      }
     
      &:focus-visible {
        color: ${red[900]};
        box-shadow: 0 0 0 4px
          ${theme.palette.mode === "dark" ? green[300] : red[900]};
        outline: none;
      }
  
      &:disabled {
        opacity: 0.5; /* Reducir la opacidad del botón */
        cursor: not-allowed; /* Cambiar el cursor del ratón */
      }
      &:hover.cancel-hover {
        color: var(--color-codGray-950);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1), 0 0 0 2px rgba(0, 0, 0, 0.1); /* Agregamos una sombra más pronunciada al hacer hover */    }
      }
        &:hover.eliminar-hover{
            color: red[900];
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1), 0 0 0 2px ${red[300]
    }; /* Agregamos una sombra más pronunciada al hacer hover */    }
        }

        `
);

const EditButton = styled("button")(
  ({ theme }) => css`
      font-family: "IBM Plex Sans", sans-serif;
      font-weight: 600;
      font-size: 0.875rem;
      line-height: 1.5;
      padding: 8px 16px;
      border-radius: 5px;
      transition: all 150ms ease;
      cursor: pointer;
      border: 1px solid transparent; /* Borde transparente */
      background-color: transparent; /* Fondo transparente */
      color: var(--dell-950); /* Color de texto */
    
      &:hover:not(:disabled) {
        color:var(--dell-600); /* Cambia el color al hacer hover */
      }
    
      &:active:not(:disabled) {
        color: ${red[900]}; /* Cambia el color al activar (click) */
      }
    
      &:focus-visible {
        box-shadow: 0 0 0 4px ${theme.palette.mode === "dark" ? green[300] : green[200]
    };
        outline: none;
      }
    
      &:disabled {
        opacity: 0.5; /* Reducir la opacidad del botón */
        cursor: not-allowed; /* Cambiar el cursor del ratón */
      } not-allowed; /* Cambiar el cursor del ratón */
        }
      `
);
