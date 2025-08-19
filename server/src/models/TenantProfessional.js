const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "TenantProfessional",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      TenantId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "Tenant", // Nombre del modelo Tenant
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
      role: {
        type: DataTypes.ENUM("Owner", "Master", "Admin", "Staff"),
        allowNull: false,
      },
      active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true, // Por defecto, el profesional está activo
      },
      joinedAt: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      dismissedAt: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      hooks: {
        beforeCreate: (tenantProfessional, options) => {
          if (!tenantProfessional.joinedAt) {
            tenantProfessional.joinedAt = new Date();
          }
        },
      },
    }
  );
};
