module.exports = (sequelize,DataTypes) =>{
    const Salary = sequelize.define("salary",{
        employee_id:{
            type : DataTypes.INTEGER,
            allowNull:false
        },
        salary :{
            type : DataTypes.DOUBLE,
            allowNull:false
        },
        isActive :{
            type : DataTypes.BOOLEAN,
            allowNull : false
        }
    })
    return Salary
}