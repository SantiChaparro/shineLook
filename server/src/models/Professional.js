const { DataTypes } = require("sequelize");


module.exports = (sequelize) => {

    sequelize.define('Professional', {

        dni: {
            type: DataTypes.INTEGER,
            primaryKey: true,

        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        mail: {
            type: DataTypes.STRING,
            allowNull: true,

            // validate:{
            //     isEmail: true,
            //  }

        },
        role: {
            type: DataTypes.STRING,
            defaultValue: 'Master',
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        services: {
            type: DataTypes.ARRAY(DataTypes.JSON),
            allowNull: true,
        },
        profileImage: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        profileImageId: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    })
};