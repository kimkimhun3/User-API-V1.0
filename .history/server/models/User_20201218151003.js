module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        email: DataTypes.STRING,
        name: DataTypes.STRING,
        gender: DataTypes.STRING,
        phonenumber: DataTypes.STRING,
        batch: DataTypes.STRING,
        dob: DataTypes.STRING,
        base64Code: DataTypes.STRING,
        attended: DataTypes.BOOLEAN,
        profileImage: DataTypes.BLOB
        
    })
    return User
}