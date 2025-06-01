module.exports = (sequelize, DataTypes) => {
    const GradeSection = sequelize.define("grade_section", {
        grade_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        isActive :{
            type : DataTypes.BOOLEAN,
            allowNull : false,
            default : true
        }
    })
    return GradeSection
}