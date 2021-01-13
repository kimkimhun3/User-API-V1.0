module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        email: DataTypes.STRING,
        name: DataTypes.STRING,
        gender: DataTypes.STRING,
        major: DataTypes.STRING,
        phonenumber: DataTypes.STRING,
        batch: DataTypes.STRING,
        dob: DataTypes.STRING,
        base64Code: DataTypes.STRING,
        attended: DataTypes.BOOLEAN,
        profileImage: Data
        
    })
    return User
}