export const clientSchema = {
  name: {
    type: "text",
    label: "Nombre",
    required: true,
  },

  dni: {
    type: "text",
    label: "DNI",
    required: true,
  },

  DateOfBirth: {
    type: "date",
    label: "Fecha de nacimiento",
    required: false,
  },

  phone: {
    type: "text",
    label: "Teléfono",
    required: false,
  },

  mail: {
    type: "text",
    label: "Correo",
    required: false,
  },
};
