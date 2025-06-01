module.exports = (sequelize, DataTypes) => {
  const FundType = sequelize.define("fund_type", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    initial_balance: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    current_balance: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  })
  return FundType
}