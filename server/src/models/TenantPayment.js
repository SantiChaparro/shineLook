const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "TenantPayment",
    {
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
      subcriptionId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "Subscription",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      provider: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      providerID: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      currency: {
        type: DataTypes.ENUM("ARS", "USD"),
        allowNull: false,
      },
      state: {
        type: DataTypes.ENUM("sucess", "pending", "failed"),
        allowNull: false,
      },
      paidAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      hooks: {
        beforeCreate: (paymentSubscription, options) => {
          if (!paymentSubscription.paidAt) {
            paymentSubscription.paidAt = new Date();
          }
        },
      },
    }
  );
};
