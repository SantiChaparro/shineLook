import { Box, Typography } from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";

const EmptyState = () => (
  <Box
    sx={{
      height: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      color: "#999",
      gap: 2,
    }}
  >
    <PersonOutlineIcon sx={{ fontSize: 64, opacity: 0.4 }} />
    <Typography fontSize={18}>
      Seleccioná un elemento del listado
    </Typography>
  </Box>
);

export default EmptyState;
