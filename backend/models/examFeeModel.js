module.exports = (sequelize, DataTypes) => {
    const ExamFee = sequelize.define("exam_fee", {
        student_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        student_enrollment_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        exam_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        amount_due: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        amount_paid: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0
        },
        due_date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        payment_date: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        is_paid: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    });

    return ExamFee;
};
