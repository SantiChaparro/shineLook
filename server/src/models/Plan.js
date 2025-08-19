const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("Plan", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    feature: {
      type: DataTypes.JSONB, //! Debemnos estructurar el json para control, pero antesn hay que determinar cuales son las variable que van a determinar las caracteristicas de los planes
      allowNull: false,
    },
  });
};
