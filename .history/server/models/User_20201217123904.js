module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        name: DataTypes.STRING,
        age: DataTypes.STRING,
        sex: DataTypes.STRING,
        email: DataTypes.STRING,
        phonenumber: DataTypes.STRING,
        batch: DataTypes.STRING,
        major: DataTypes.STRING
        attended: DataTypes.BOOLEAN
    })
    return User
}