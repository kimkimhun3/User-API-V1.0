module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        name: DataTypes.STRING,
        gender: DataTypes.STRING,
        email: DataTypes.STRING,
        phonenumber: DataTypes.STRING,
        batch: DataTypes.STRING,
        major: DataTypes.STRING,
        attended: DataTypes.BOOLEAN,
        base64Code: DataTypes.STRING,
        dob: DataTypes.STRING,
    })
    return User
}