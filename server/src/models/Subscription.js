const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "Subscription",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      tenantId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "Tenant",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      planId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "Plan",
          key: "id",
        },
      },
      state: {
        type: DataTypes.ENUM(
          "active",
          "suspended",
          "cancelled",
          "trial",
          "expired"
        ),
        allowNull: false,
      },
      startDate: {
        type: DataTypes.DATE,
        defaultValue: new Date(),
      },
      endDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      paymentId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "Payment",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    },
    { timestamps: true }
  );
};
