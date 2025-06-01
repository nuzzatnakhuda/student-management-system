module.exports = (sequelize, DataTypes) => {
    const SchoolFund = sequelize.define("school_fund", {
      initial_balance: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
      },
      current_balance: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
      },
    })
    return SchoolFund
  }