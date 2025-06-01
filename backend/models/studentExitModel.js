const { student_enrollment } = require(".")

module.exports = (sequelize, DataTypes) => {
    const StudentExit = sequelize.define("student_exit", {
        student_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        student_enrollment_id : {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        exit_date: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },
        exit_reason: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    })
    return StudentExit
}