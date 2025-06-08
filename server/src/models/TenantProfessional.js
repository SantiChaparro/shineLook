const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("TenantProfessional", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    TenantId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Tenants", // Nombre del modelo Tenant
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    ProfessionalDni: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Professional", // Nombre del modelo Professional
        key: "dni",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true, // Por defecto, el profesional está activo
    },
  });
};
