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
         },  //! Ya no deberia aplicarse el rol como atributo ya que depende de la relacion que tenga con el tenant ya que puede tener diferentes roles segun el contexto   

        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        services: {
            type: DataTypes.ARRAY(DataTypes.JSON),
            allowNull: true,
        } //! Esto debemos analizar porque los profesionale son globales y los servicios pueden varian en cada negocio que desarrollen sus actividades.
    })
};