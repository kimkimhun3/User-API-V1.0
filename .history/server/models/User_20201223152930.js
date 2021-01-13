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
        profileImage: DataTypes.STRING,
        
    })
    return User
}


// Channels is not available anymore, reason is we are trying to find the free TV, but it always keep changing FR, So we need to spend time to find it anymore, 