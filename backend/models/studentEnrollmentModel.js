module.exports = (sequelize, DataTypes) => {
    const StudentEnrollment = sequelize.define("student_enrollment", {
        student_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        grade_section_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        academic_year: {
            type: DataTypes.STRING,
            allowNull: false
        },
        enrollment_date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('active', 'promoted', 'completed', 'dropped'),
            allowNull: false,
            defaultValue: 'active',
        },
        remarks: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    })
    return StudentEnrollment
}