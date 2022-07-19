const express = require('express');
const router = express.Router()
const kanbanController = require('../Controllers/kanban.controller')
const {isAuthenticated} = require('../Middleware/auth.middleware')
const {isAdmin} = require('../Middleware/admin.middleware')

router.get('/getkanban/:id',isAuthenticated,kanbanController.getKanban)
router.post('/addtask',isAuthenticated,kanbanController.postAddTask)
router.patch('/removetask',isAuthenticated,kanbanController.patchRemoveTask)
router.post('/edittask',isAuthenticated,kanbanController.postEditTask)
router.post('/movesame',isAuthenticated,kanbanController.postMoveSame)
router.post('/movedifferent',isAuthenticated,kanbanController.postMoveDifferent)
 









module.exports = router