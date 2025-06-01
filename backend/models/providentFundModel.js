module.exports = (sequelize, DataTypes) => {
    const ProvidentFund = sequelize.define("provident_fund", {
        employee_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        pay_roll_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        contribution_date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        employee_contribution: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        }, 
        employer_contribution: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        total_contribution: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        accumulated_balance: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
        }
    })
    return ProvidentFund
}