const dummyData = require('../utils/utils')
const User = require('../Models/user.model')
const InventoryItem = require('../Models/InventoryItem')


const getDashboardData = (req, res) =>{
    res.json(dummyData)
}

const patchUserRole = async (req, res) => {
    try {
      const { role } = req.body;
      const allowedRoles = ['user', 'admin'];
  
      if (!allowedRoles.includes(role)) {
        return res
          .status(400)
          .json({ message: 'Role not allowed' });
      }
      await User.findOneAndUpdate(
        { _id: req.user.sub },
        { role }
      );
      res.json({
        message:
          'User role updated. You must log in again for the changes to take effect.'
      });
    } catch (err) {
      return res.status(400).json({ error: err });
    }
  }

  const getInventory = async (req, res) => {
    try {
      const {sub} = req.user
      const inventoryItems = await InventoryItem.find({
        user:sub
      });
      res.json(inventoryItems);
    } catch (err) {
      return res.status(400).json({ error: err });
    }
  }

  const postInventory = async (req, res) => {
    try {
      const {sub} = req.user
      const input = Object.assign({},req.body,{
        user: sub
      })
      const inventoryItem = new InventoryItem(input);
      await inventoryItem.save();
      res.status(201).json({
        message: 'Inventory item created!',
        inventoryItem
      });
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        message: 'There was a problem creating the item'
      });
    }
  }

  const deletInventory = async (req, res) => {
  try {
    const {sub} = req.user
    const deletedItem = await InventoryItem.findOneAndDelete(
      { _id: req.params.id,user:sub }
    );
    res.status(201).json({
      message: 'Inventory item deleted!',
      deletedItem
    });
  } catch (err) {
    return res.status(400).json({
      message: 'There was a problem deleting the item.'
    });
  }
};

const getUsers = async (req, res) => {
    try {
      const users = await User.find()
        .lean()
        .select('_id firstName lastName avatar bio');
  
      res.json({
        users
      });
    } catch (err) {
      return res.status(400).json({
        message: 'There was a problem getting the users'
      });
    }
  }

  const getBio = async (req, res) => {
    try {
      const { sub } = req.user;
      const user = await User.findOne({
        _id: sub
      })
        .lean()
        .select('bio');
  
      res.json({
        bio: user.bio
      });
    } catch (err) {
      return res.status(400).json({
        message: 'There was a problem updating your bio'
      });
    }
  }

const patchBio = async (req, res) => {
  
    try {
      const { sub } = req.user;
      const { bio } = req.body;
      const updatedUser = await User.findOneAndUpdate(
        {
          _id: sub
        },
        {
          bio
        },
        {
          new: true
        }
      );
  
      res.json({
        message: 'Bio updated!',
        bio: updatedUser.bio
      });
    } catch (err) {
      return res.status(400).json({
        message: 'There was a problem updating your bio'
      });
    }
  }




module.exports = {
    getDashboardData,
    patchUserRole,
    getInventory,
    postInventory,
    deletInventory,
    getUsers,
    getBio,
    patchBio
}
