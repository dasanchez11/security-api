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
      const {user} = req.session
      const inventoryItems = await InventoryItem.find({
        user:user._id
      });
      res.json(inventoryItems);
    } catch (err) {
      return res.status(400).json({ error: err });
    }
  }

  const postInventory = async (req, res) => {
    try {
      const {user} = req.session
      const input = Object.assign({},req.body,{
        user: user._id
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
    const {user} = req.session
    const deletedItem = await InventoryItem.findOneAndDelete(
      { _id: req.params.id,user:user._id }
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
      const sessionUser = req.session.user._id;
      const user = await User.findOne({
        _id: sessionUser
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
      const {user} = req.session
      const { bio } = req.body;
      const updatedUser = await User.findOneAndUpdate(
        {
          _id: user._id
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

  const getUserInfo = (req,res,next)=>{
    const {user} = req.session;
    if(!user) {
      return res.status(401).json({message:'Unauthorized'})
    }
    setTimeout(()=>{
      res.status(200).json({user})
    },1000)
  }


  const postLogout = (req,res)=>{
    req.session.destroy(error=>{
      if(error){
        return res.status(400).json({message:'There was a problem logging out'})
      }
    })
    res.status(200).json({message:'Logout Successful'})
  }




module.exports = {
    getDashboardData,
    patchUserRole,
    getInventory,
    postInventory,
    deletInventory,
    getUsers,
    getBio,
    patchBio,
    postLogout,
    getUserInfo
}
