module.exports = (sequelize, DataTypes) => {
    const Grade = sequelize.define("grade", {
        session_id: {
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
    return Grade
}