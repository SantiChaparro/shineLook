export const professionalSchema = {
  name: { type: "text", label: "Nombre" },
  dni: { type: "text", label: "DNI" },
  phone: { type: "text", label: "Teléfono" },
  mail: { type: "text", label: "Correo" },

  services: {
    type: "array",
    label: "Servicios",
    itemFields: {
      idService: { type: "text", label: "ID Servicio" },
      primary: { type: "text", label: "Comisión primaria" },
      secondary: { type: "text", label: "Comisión secundaria" },
    },
  },
};


