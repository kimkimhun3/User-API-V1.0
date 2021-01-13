module.exports = {
    port: process.env.PORT || 3000,
    db: {
        database: process.env.DB_NAME || 'Register-data',
        user: process.env.DB_USER || 'admin',
        password: process.env.DB_USER || 'admin',
        options: {
            dialect: process.env.DIALECT || 'sqlite',
            host: process.env.HOST || 'localhost',
            storage: './Register-data.sqlite'
        }
    }
}