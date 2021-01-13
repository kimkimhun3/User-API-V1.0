module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        name: DataTypes.STRING,
        age: DataTypes.STRING,
        sex: DataTypes.STRING,
        currentjob: DataTypes.STRING,
        profileImage: DataTypes.BLOB,
        email: DataTypes.STRING,
        phonenumber: DataTypes.STRING
    })
    return User
}