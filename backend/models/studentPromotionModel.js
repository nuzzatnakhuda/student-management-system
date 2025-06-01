module.exports = (sequelize, DataTypes) => {
    const StudentPromotion = sequelize.define("student_promotion", {
        student_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        old_enrollment_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        new_enrollment_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        promotion_date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
    })
    return StudentPromotion
}