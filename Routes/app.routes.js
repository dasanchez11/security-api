const express = require('express');
const router = express.Router();
const appController = require('../Controllers/app.controller');
const {isAuthenticated} = require('../Middleware/auth.middleware')
const {isAdmin} = require('../Middleware/admin.middleware')

router.get('/dashboard-data',isAuthenticated,appController.getDashboardData);
router.patch('/user-role',isAuthenticated,appController.patchUserRole)
router.get('/inventory',isAuthenticated,isAdmin,appController.getInventory);
router.post('/inventory',isAuthenticated,isAdmin,appController.postInventory);
router.delete('/inventory/:id',isAuthenticated,isAdmin,appController.deletInventory);
router.get('/users', isAuthenticated,isAdmin,appController.getUsers);
router.get('/bio', isAuthenticated,appController.getBio);
router.patch('/bio', isAuthenticated,appController.patchBio);
router.post('/logout',isAuthenticated,appController.postLogout)
router.get('/user-info',isAuthenticated,appController.getUserInfo)


module.exports = router;









module.exports = router
