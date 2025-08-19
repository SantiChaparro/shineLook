const { DataTypes } = require("sequelize");

/*  Definimos el modelo tenant que representara a una compañia  o un profesional que creo el registro de su negocio
 */
module.exports = (sequelize) => {
  sequelize.define(
    "Tenant",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      cuit: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      companyName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isSoloProfessional: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      createdBy: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "TenantProfessional",
          key: "id",
        },
      },
      currentSubscription: { //esto apunta a al subscripcion vigente
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "Subscription",
          key: "id",
        },
      },
    },
    { timestamps: true } // agrega createdAt y updateAt, createdAt lo vamos a usar para controlar la vigencia del plan free

  );
};
