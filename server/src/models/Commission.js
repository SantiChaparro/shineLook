const { DataTypes } = require("sequelize");


module.exports = (sequelize) => {

    sequelize.define('Commission', {

        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,

        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        amount: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        category: {
            type: DataTypes.STRING,
            allowNull: true
        },
        paid: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }

    })
};