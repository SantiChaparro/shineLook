import { createTheme } from "@mui/material/styles";
import { ThemeProvider } from "@mui/system";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import "dayjs/locale/es";
import * as React from "react";
import "./DatePicker.css";
dayjs.locale('es')
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

export default function BasicDatePicker({
  date,
  handleChangeDate,
  sizeField,
  widthField,
}) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
      <ThemeProvider theme={theme}>
        <DatePicker
          label="Fecha"
          value={date}
          onChange={(newDate) => handleChangeDate(newDate)}
          format="DD/MM/YYYY"
          sx={{
            width: `${widthField}`,
          }}
          slotProps={{
            textField: { size: `${sizeField}`, color: "success" },
            openPickerButton: { color: "primary" },
          }}
        />
      </ThemeProvider>
    </LocalizationProvider>
  );
}

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
