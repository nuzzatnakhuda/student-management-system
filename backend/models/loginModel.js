const bcrypt = require('bcrypt')

module.exports = (sequelize, DataTypes) => {
    const Login = sequelize.define("login", {
        employee_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        username: {
            type: DataTypes.STRING,
            unique: true, // Ensure usernames are unique
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    },{
        hooks: {
            // Hash the password before saving it to the database
            beforeCreate: async (login) => {
                if (login.password) {
                    const salt = await bcrypt.genSalt(10); // Generate salt
                    login.password = await bcrypt.hash(login.password, salt); // Hash the password
                }
            },
            beforeUpdate: async (login) => {
                if (login.password) {
                    const salt = await bcrypt.genSalt(10);
                    login.password = await bcrypt.hash(login.password, salt);
                }
            },
        },
    })
    Login.prototype.comparePassword = async function (candidatePassword) {
        return bcrypt.compare(candidatePassword, this.password);
      };
return Login
}