// models/TenantClient.js
const { DataTypes } = require("sequelize");

module.exports = ( sequelize) => {
    sequelize.define("TenantClient", {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      TenantId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Tenant",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      ClientDni: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Client",
          key: "dni",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    });
  };
  