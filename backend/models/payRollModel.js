module.exports = (sequelize, DataTypes) => {
    const PayRoll = sequelize.define("pay_roll", {
        employee_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        month :{
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        payment_date: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },
        salary: {
            type: DataTypes.INTEGER,
            allowNull: false
        }, 
        bonus: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
            defaultValue: 0,
        },
        deductions: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
            defaultValue: 0,
        },
        net_salary: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        remarks: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        is_paid : {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        }
    })
    return PayRoll
}