const { Thought, User } = require('../models');

module.exports = {
    // get all thoughts
    async getThoughts(req, res) {
        try {
            const thoughts = await Thought.find().select('-__v');
            res.json(thoughts);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // get a single thought by its id
    async getSingleThought(req, res) {
        try {
            const thought = await Thought.findOne({ _id: req.params.thoughtId }).populate('reactions').select('-__v');

            if (!thought) {
                return res.status(404).json({ message: 'No thought found with that ID' });
            }
            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // create a new thought
    async createThought(req, res) {
        try {
            const thought = await Thought.create({
                thoughtText: req.body.thoughtText,
                username: req.params.username
            });
            res.json(thought);
            await User.findOneAndUpdate(
                { username: req.params.username },
                { $push: { thoughts: thought.id } },
                { runValidators: true, new: true }
            );

        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    },
    // update a thought by its id
    async updateThought(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $set: req.body },
                { runValidators: true, new: true }
            );

            if (!thought) {
                res.status(404).json({ message: 'No thought found with that ID' });
            }
            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // delete a thought by its id
    async deleteThought(req, res) {
        try {
            const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId });
           
            if (!thought) {
                res.status(404).json({ message: 'No thought found with that ID' });
            }
            res.json('Thought deleted!');
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // add a reaction to a thought
    async addReaction(req, res) {
        console.log('You are adding a reaction')

        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                {
                    $addToSet: {
                        reactions: {
                            reactionBody: req.body.reactionBody,
                            username: req.params.username
                        }
                    }
                },
                { runValidators: true, new: true }
            );

            if (!thought) {
                res.status(404).json({ message: 'No thought found with that ID' })
            }
            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // delete a reaction from a thought
    async deleteReaction(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $pull: { reactions: { reactionId: req.params.reactionId } } },
                { runValidators: true, new: true }
            );

            if (!thought) {
                res.status(404).json({ message: 'No thought found with that ID' })
            }
            console.log('Reaction deleted!');
            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },
};
