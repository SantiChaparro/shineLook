const {DataTypes} = require("sequelize");


module.exports = (sequelize) => {

    sequelize.define('Appointment',{

        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            
        },
        date:{
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        time:{
            type: DataTypes.TIME,
            allowNull: false,
        },
        duration:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        deprived:{
            type:DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue:false,
        },
        paid:{
            type:DataTypes.BOOLEAN,
            defaultValue: false
        },
        cost:{
            type:DataTypes.FLOAT,
            allowNull:false
        }
    })
};