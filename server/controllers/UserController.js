const {User} = require('../models')

module.exports = {
    async index(req, res)  {
        try{
        const users = await User.findAll({
            limit: 14
        })
        res.send(users)
    }
    catch(err){
        res.status(500).send({
            error: 'An error has occured trying to fetch the users'
        })
    }
    },

    async show(req, res){
        try{
            const user = await User.findByPk(req.params.userId)
            res.send(user)
        }
        catch(err){
            res.status(500).send({
                error: 'An error has occured trying to show the user'
            })

        }
    },

    async post(req, res) {
        try{
            const user = await User.create(req.body)
            res.send(user)
        }
        catch(err){
            res.status(500).send({
                error: 'An error has occured trying to create the user'
            })

        }
    },

    async put (req, res) {
        try {
          await User.update(req.body, {
            where: {
              id: req.params.userId
            }
          })
          res.send(req.body)
        } catch (err) {
          res.status(500).send({
            error: 'an error has occured trying to update the user'
          })
        }
      },
      
    async remove(req, res) {
        try{
            const user = await User.findOne({
                where: {
                    id: req.params.userId
                }
            })
            if (!user){
                return res.status(500).send({
                    error: 'This user does not exist'
                })
            }
            await user.destroy()
            res.send(user.name + " has deleted successfully")
        }
        catch(err){
            res.status(500).send({
                error: 'an error has occured trying to delete the user'
            })
        }
    }
}