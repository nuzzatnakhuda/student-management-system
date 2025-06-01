module.exports = (sequelize,DataTypes) =>{
    const Designation = sequelize.define("designation",{
        designation : {
            type : DataTypes.STRING,
            allowNull : false
        }
    })
    return Designation
}