
const {DataTypes} = require("sequelize");


module.exports = (sequelize) => {

    sequelize.define('Service',{

        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            
        },
        service_name:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        category:{
            type: DataTypes.ENUM('Peluquería','Estética'),
            allowNull: false
            
        },
        cost:{
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        isDeleted:{
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: true
        }
        
    })
};