const { User, Thought } = require('../models');

module.exports = {
    // get all users
    async getUsers(req, res) {
        try {
            const users = await User.find().select('-__v');
            res.json(users);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // get a single user by its id
    async getSingleUser(req, res) {
        try {
            const user = await User.findOne({ _id: req.params.userId })
                .populate('thoughts friends')
                .select('-__v');

            if (!user) {
                return res.status(404).json({ message: 'No user with that ID' });
            }
            res.json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // create a user
    async createUser(req, res) {
        try {
            const user = await User.create(req.body);
            res.json(user);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    },
    // update a user by its id
    async updateUser(req, res) {
        try {
            const user = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $set: req.body },
                { runValidators: true, new: true }
            );

            if (!user) {
                res.status(404).json({ message: 'No user found with that ID' });
            }
            res.json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // delete a user by its id
    async deleteUser(req, res) {
        try {
            const user = await User.findOneAndDelete({ _id: req.params.userId });
            if (!user) {
                res.status(404).json({ message: 'No user found with that ID' });
            }
            // *BONUS* delete all thoughts created by user 
            await Thought.deleteMany({ _id: { $in: user.thoughts }});
            res.json({ message: 'User and thoughts deleted!' });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // add a new friend to a user's friends list
    async addFriend(req,res) {
        console.log('You are adding a friend.');
    
        try {
            const user = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $addToSet: { friends: req.params.friendId } },
                { runValidators: true, new: true }
            );

            if(!user) {
                res.status(404).json({ message: 'No user found with that ID '})
            }
            res.json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // delete a friend from the user's friends list
    async deleteFriend(req,res) {
        console.log('You are deleting a friend.')
        try {
            const user = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $pull: { friends: req.params.friendId } },
                { runValidators: true, new: true }
            );

            if(!user) {
                res.status(404).json({ message: 'No user found with that ID '})
            }
            res.json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },
};