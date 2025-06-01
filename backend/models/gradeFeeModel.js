module.exports = (sequelize, DataTypes) => {
    const GradeFee = sequelize.define("grade_fee", {
        grade_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        fee: {
            type: DataTypes.DOUBLE,
            allowNull: false,
        },
        description : {
            type: DataTypes.DOUBLE,
            allowNull: true,   
        },
        isActive :{
            type : DataTypes.BOOLEAN,
            default : true,
            allowNull : false,
        }
    })
    return GradeFee
}