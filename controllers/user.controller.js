const User = require('../models/User');
const bcrypt = require('bcrypt');


// get users (admin)
exports.getAllUsers = async (req, res) => {
    try {

        const users = await User.find().select('-password')
        res.json(users);

    } catch (error) {
        console.error("Message : ", error)
        res.status(500).send('Server Error');
    }
}

// get user by id (admin)

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password')
        if (!user) return res.status(404).send('User not found');
        res.json(user);
    } catch (err) {
        console.error(err)
        res.status(500).send('Server Error');
    }
}

// delete user (admin)

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id).select('-password')
        if (!user) return res.status(404).send('User not found');
        res.json({ message: "User deleted successfully" })
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
}

// updtae user. (admin)

exports.updateUser = async (req, res) => {
    try {
        let { password, role } = req.body;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            password = await bcrypt.hash(password, salt);
        }
        const user = await User.findByIdAndUpdate(req.params.id, { password, role }, { new: true }).select('-password')
        if (!user) return res.status(404).send('User not found');
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
}