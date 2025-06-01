module.exports = (sequelize,DataTypes) =>{
    const Employee = sequelize.define("employee",{
        full_name : {
            type : DataTypes.STRING,
            allowNull : false
        },
        date_of_birth : {
            type : DataTypes.DATEONLY,
            allowNull : false
        },
        gender : {
            type : DataTypes.STRING,
            allowNull : false
        },
        contact_number : {
            type : DataTypes.STRING,
            allowNull : false
        },
        email : {
            type : DataTypes.STRING,
            allowNull : false
        },
        address : {
            type : DataTypes.TEXT,
            allowNull : false
        },
        aadhar :{
            type : DataTypes.STRING,
            allowNull : false
        },
        hasPF :{
            type : DataTypes.BOOLEAN,
            allowNull : false
        },
        isActive :{
            type : DataTypes.BOOLEAN,
            allowNull : false
        }
    })
    return Employee
}