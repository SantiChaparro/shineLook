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
        model: "Professional",
        key: "dni",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true, 
    },
    totalRating: {
      type: DataTypes.INTEGER,
      allowNull: true,        
      defaultValue: null,
    },
    ratingCount: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    ratingAverage:{
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: null,
    }
  });
};
