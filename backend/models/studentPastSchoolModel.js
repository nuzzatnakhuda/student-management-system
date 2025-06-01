module.exports = (sequelize, DataTypes) => {
    const StudentPastSchool = sequelize.define("student_past_school", {
        student_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        school_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        last_grade: {
            type: DataTypes.STRING,
            allowNull: false
        },
        academic_year: {
            type: DataTypes.STRING,
            allowNull: false
        },
        reason_for_leaving: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    })
    return StudentPastSchool
}