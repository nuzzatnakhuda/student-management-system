module.exports = (sequelize, DataTypes) => {
    const EmployeeProvident = sequelize.define("employee_provident", {
        employee_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        accumulated_balance: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        isActive :{
            type : DataTypes.BOOLEAN,
            allowNull : false
        }
    })
    return EmployeeProvident
}