module.exports = (sequelize,DataTypes) =>{
    const Session = sequelize.define("session",{
        session : {
            type : DataTypes.STRING,
            allowNull : false
        }
    })
    return Session
}