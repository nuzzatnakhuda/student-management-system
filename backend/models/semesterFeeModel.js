module.exports = (sequelize, DataTypes) => {
    const SemesterFee = sequelize.define("semester_fee", {
        student_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        student_enrollment_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        semester: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                is: /^(JUNE|DECEMBER) \d{4}$/ // Ensures format "June YYYY" or "December YYYY"
            }
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

    return SemesterFee;
};
