module.exports = (sequelize,DataTypes) =>{
    const JobDetail = sequelize.define("job_detail",{
        employee_id:{
            type : DataTypes.INTEGER,
            allowNull:false
        },
        session_id:{
            type : DataTypes.INTEGER,
            allowNull:false
        },
        designation_id:{
            type : DataTypes.INTEGER,
            allowNull:false
        },
        date_of_join : {
            type : DataTypes.DATEONLY,
            allowNull : false
        },
        date_of_exit : {
            type : DataTypes.DATEONLY,
            allowNull : true
        }
    })
    return JobDetail
}