
module.exports = (sequelize, DataTypes) => {
    const MonthlyFee = sequelize.define("monthly_fee", {
        student_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        student_enrollment_id : {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        month :{
            type:DataTypes.DATEONLY,
            allowNull: false
        },
        amount_due: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        amount_paid: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0,
        },
        payment_date: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },
        is_paid: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    })
    return MonthlyFee
}