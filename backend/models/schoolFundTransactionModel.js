module.exports = (sequelize, DataTypes) => {
    const SchoolFundTransaction = sequelize.define("school_fund_transaction", {
        transaction_date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        type: {
            type: DataTypes.ENUM('income', 'expense'),
            allowNull: false,
        },
        amount: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
        },
        balance_after: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    })
    return SchoolFundTransaction
}