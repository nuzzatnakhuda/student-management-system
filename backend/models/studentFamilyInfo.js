module.exports = (sequelize, DataTypes) => {
    const StudentFamilyInfo = sequelize.define("student_family_info", {
        student_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        religion: {
            type: DataTypes.STRING,
            allowNull: false
        },
        caste: {
            type: DataTypes.STRING,
            allowNull: false
        },
        place_of_birth: {
            type: DataTypes.STRING,
            allowNull: false
        },
        father_occupation: {
            type: DataTypes.STRING,
            allowNull: true
        },
        occupation_address: {
            type: DataTypes.TEXT,
            allowNull: true
        },
    })
    return StudentFamilyInfo
}