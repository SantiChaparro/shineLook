const {DataTypes} = require("sequelize");


module.exports = (sequelize) => {

    sequelize.define('Client',{

        dni:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            
        },
        name:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        DateOfBirth:{
            type: DataTypes.DATEONLY,

            defaultValue:null,// Establece el valor predeterminado como nulo
            allowNull: true, // Permite valores nulos

        },
        phone:{
            type: DataTypes.STRING,
            allowNull: true,
        },
        mail:{
            type: DataTypes.STRING,
            allowNull: true,

            // validate:{
            //     isEmail: true,
            //  }

        }
    })
};