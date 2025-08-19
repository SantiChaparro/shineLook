// models/TenantClient.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("TenantClient", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    TenantId: {
      type: DataTypes.UUID,
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
      onDelete: "CASCADE", //! no seria necesario ya que lo que debemos hacer es bloquear al cliente
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  });
};
