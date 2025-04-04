const {DataTypes} = require("sequelize");


module.exports = (sequelize) => {

    sequelize.define('Tenants',{
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true, // ID autogenerado
            primaryKey: true,    // Es la clave primaria
          },

        dni:{
            type: DataTypes.INTEGER,
            allowNull:false
        },
        nombre:{
            type: DataTypes.STRING,
            allowNull: false,
        },
      
        telefono:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        mail:{
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                isEmail: true,
             }
        },
        rol:{
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'Master'
        },
        password:{
            type: DataTypes.STRING,
            allowNull: false
        },
        activo:{
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
       
    })
};