const Badge = ({ state, text }) => {
  const styles = {
    success: {
      color: colors.dell[900],
      bgColor: colors.dell[200],
      colorText: colors.dell[900],
    },
    error: {
      color: colors.red[900],
      bgColor: colors.red[200],
      colorText: colors.red[900],
    },
    undefined: {
      color: colors.codGray[600],
      bgColor: colors.codGray[200],
      colorText: colors.codGray[600],
    },
    partial: {
      color: colors.orange[900],
      bgColor: colors.orange[200],
      colorText: colors.orange[900],
    },
  };

  return (
    
      <span
        style={{
            width: "fit-content",
        minWidth: "40px",
        border: `2px solid ${styles[state].color}`,
        padding: "2px 6px",
        borderRadius: "40px",
        backgroundColor: `${styles[state].bgColor}`,
        display: "inline-block",
        fontSize: "0.6rem",
          fontWeight: "bold",
          color: `${styles[state].colorText}`,
          textAlign: "center",
        }}>
        {text}
      </span>
    
  );
};

export default Badge;

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
  red: {
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
    950: "#5F0707",
  },
  orange: {
    50: "#FFF3E0",
    100: "#FFE0B2",
    200: "#FFCC80",
    300: "#FFB74D",
    400: "#FFA726",
    500: "#FF9800",
    600: "#FB8C00",
    700: "#F57C00",
    800: "#EF6C00",
    900: "#E65100",
    950: "#BF360C",
  },
};
