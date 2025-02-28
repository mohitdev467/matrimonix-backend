const upload = require("../../helpers/imageUploadHelper");
const UserSchema = require("../../models/adminModel/UserSchema");
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

module.exports.getUsers = async (req, res) => {
    try {
      const users = await UserSchema.find();
      res.status(200).json(users);
    } catch (error) {
      res.status(400).json({ message: 'Error fetching users', error });
    }
  };


  module.exports.addUser = [
    upload.single('user_avtar'),
    async (req, res) => {
      try {
        const { password, ...userData } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = new UserSchema({
          ...userData,
          password: hashedPassword,
          user_avtar: req.file ? req.file.path : ''
        });
        await user.save();
        res.status(201).json({ message: 'User added successfully', user });
      } catch (error) {
        res.status(400).json({ message: 'Error adding user', error });
      }
    }
  ];



  // Change user status
module.exports.changeUserStatus = async (req, res) => {
    try {            
      const { userId, status } = req.body;
      const user = await UserSchema.findByIdAndUpdate(userId, { status: status }, { new: true });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({ message: 'User status updated successfully', user });
    } catch (error) {
      res.status(400).json({ message: 'Error updating user status', error });
    }
  };
  
  // Delete user
  module.exports.deleteUser = async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await UserSchema.findByIdAndDelete(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(400).json({ message: 'Error deleting user', error });
    }
  };

  module.exports.getUserById = async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await UserSchema.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(400).json({ message: 'Error fetching user', error });
    }
  };

  module.exports.updateUser = [
    upload.single('user_avtar'),
    async (req, res) => {
      try {
        const { userId } = req.params;
        const { password, ...userData } = req.body;
        if (password) {
          const salt = await bcrypt.genSalt(10);
          userData.password = await bcrypt.hash(password, salt);
        }
        if (req.file) {
          userData.user_avtar = req.file.path;
        }
        const user = await UserSchema.findByIdAndUpdate(userId, userData, { new: true });
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User updated successfully', user });
      } catch (error) {
        res.status(400).json({ message: 'Error updating user', error });
      }
    }
  ];