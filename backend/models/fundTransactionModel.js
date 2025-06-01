module.exports = (sequelize, DataTypes) => {
    const FundTransaction = sequelize.define("fund_transaction", {
        fund_type_id:{
            type : DataTypes.INTEGER,
            allowNull:false
        },
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
    return FundTransaction
}