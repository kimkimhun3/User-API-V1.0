const UserController = require('./controllers/UserController')

module.exports = (app) => {
    app.get('/users', UserController.index),
    app.get('/users/:userId', UserController.show),
    app.post('/users', UserController.post),
    app.put('/users/:userId', UserController.put),
    app.delete('/users/:userId', UserController.remove)

} 