import { FormControl, MenuItem, TextField } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { css, styled, ThemeProvider } from "@mui/system";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import "dayjs/locale/es";
import React, { useState, useEffect } from "react";

dayjs.locale('es');

const CommissionsNavBar = ({
  selectedDate,
  onDateChange,
  onMonthChange,
  selectedMonth,
  selectedFilter,
  onFilterChange,
}) => {
  const today = dayjs();

  // const [selectedDate, setSelectedDate] = useState(today);

  const handleDateChange = (date) => {
    const formattedDate = dayjs(date).format("YYYY-MM-DD");
    // setSelectedDate(date);
    // Llama a la función de devolución de llamada para pasar el valor seleccionado
    onDateChange(date);
  };

  // useEffect(() => {
  //   // Establecer la fecha actual al montar el componente

  //   // Cleanup function que se ejecuta cuando el componente se desmonta
  //   return () => {
  //     onDateChange(today);
  //   };
  // }, [selectedDate]);

  const handleSubmit = () => {
    const formattedDate = dayjs(selectedDate).format("YYYY-MM-DD");

    return formattedDate;
    // Aquí puedes enviar formattedDate a tu función de búsqueda en la base de datos
  };


  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "row",
        gap: "20px",
        justifyContent: "center",
        padding: "5px",
        alignItems: "center",
      }}>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
          <DatePicker
            label="Fecha"
            size="small" 
            defaultValue={selectedDate}
            onChange={handleDateChange}
            renderInput={(params) => <TextField {...params} />}
            sx={{ minWidth: 160}}
            slotProps={{
              textField: { size: "small", color: "success" },
              openPickerButton: { color: "primary" },
            }}
          />
        </LocalizationProvider>

        <FormControl>
          <TextField
            label="Seleccionar mes"
            select
            id="select"
            size="small" 
            value={selectedMonth}
            onChange={onMonthChange}
            sx={{ minWidth: 160 }}>
            <MenuItem defaultValue="00"></MenuItem>
            <MenuItem value="01">Enero</MenuItem>
            <MenuItem value="02">Febrero</MenuItem>
            <MenuItem value="03">Marzo</MenuItem>
            <MenuItem value="04">Abril</MenuItem>
            <MenuItem value="05">Mayo</MenuItem>
            <MenuItem value="06">Junio</MenuItem>
            <MenuItem value="07">Julio</MenuItem>
            <MenuItem value="08">Agosto</MenuItem>
            <MenuItem value="09">Septiembre</MenuItem>
            <MenuItem value="10">Octubre</MenuItem>
            <MenuItem value="11">Noviembre</MenuItem>
            <MenuItem value="12">Diciembre</MenuItem>
          </TextField>
        </FormControl>

        <FormControl>
          <TextField
            select
            label="Filtrar por estado"
            size="small" 
            id="filter"
            value={selectedFilter}
            onChange={onFilterChange}
            sx={{ minWidth: 200 }}>
            <MenuItem value="todo">Todos</MenuItem>
            <MenuItem value="Liquidado">Liquidado</MenuItem>
            <MenuItem value="no-liquidado">No Liquidado</MenuItem>
          </TextField>
        </FormControl>
      </ThemeProvider>
    </div>
  );
};

export default CommissionsNavBar;

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
      box-shadow: 0 0 0 4px
        ${theme.palette.mode === "dark" ? green[300] : green[200]};
      outline: none;
    }

    &:disabled {
      opacity: 0.5; /* Reducir la opacidad del botón */
      cursor: not-allowed; /* Cambiar el cursor del ratón */
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
