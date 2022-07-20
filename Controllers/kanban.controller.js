const Kanban = require('../Models/Kanban.model')


module.exports.getKanban = async (req, res, next) => {
    const kanbanId = req.params.id
    try {
        if (!kanbanId) {
            res.status(404).json({ message: 'Request could not be processed' })
        }

        const kanban = await Kanban.findById(kanbanId)

        if (!kanban) {
            res.status(404).json({ message: 'Request could not be processed' })
        }


        res.status(200).json({ message: 'Kanban found successfully', kanban })

    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: 'Something went wrong.' });
    }
}


module.exports.postAddTask = async (req, res, next) => {
    let { itemToAdd, columnName } = req.body
    columnName = columnName[0]
    const  kanbanId  = req.session.user.kanban
    try {
        if (!kanbanId) {
            return res.status(404).json({ message: 'Not Authorized to perform this action' })
        }
        if (!itemToAdd || !columnName) {
            return res.status(404).json({ message: 'Could not process your request' })
        }
        const kanban = await Kanban.findById(kanbanId)

        if (!kanban) {
            return res.status(404).json({ message: 'Request could not be processed' })
        }

        kanban[columnName].tasks.push(itemToAdd)
        await kanban.save()
        return res.status(200).json({ message: 'Task Added Successfully' })


    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: 'Something went wrong.' });
    }
}

module.exports.patchRemoveTask = async (req, res, next) => {
    let { taskId, columnName } = req.body
    columnName = columnName[0]
    const  kanbanId  = req.session.user.kanban
    try {
        if (!kanbanId) {
            return res.status(404).json({ message: 'Not Authorized to perform this action' })
        }
        if (!taskId || !columnName) {
            return res.status(404).json({ message: 'Could not process your request' })
        }
        const kanban = await Kanban.findById(kanbanId)
        if (!kanban) {
            return res.status(404).json({ message: 'Request could not be processed' })
        }

        kanban[columnName].tasks = kanban[columnName].tasks.filter(task => task.id !== taskId)
        await kanban.save()
        return res.status(200).json({ message: 'Task Removed Successfully' })

    } catch (error) {
        console.log(error)
        return res.status(400).json({ message: 'Something went wrong.' });
    }
}

module.exports.postEditTask = async (req, res, next) => {
    let { itemId, name, startDate, column } = req.body.modalInfo
    const  kanbanId  = req.session.user.kanban
    try {
        if (!kanbanId) {
            return res.status(404).json({ message: 'Not Authorized to perform this action' })
        }
        if (!itemId || !column) {
            return res.status(404).json({ message: 'Could not process your request' })
        }
        const kanban = await Kanban.findById(kanbanId)
        if (!kanban) {
            return res.status(404).json({ message: 'Request could not be processed' })
        }

        kanban[column].tasks = kanban[column].tasks.map(task => {
            if (task.id === itemId) {
                task.name = name
                task.startDate = startDate
            }
            return task
        })
        await kanban.save()
        return res.status(200).json({ message: 'Task Updated Successfully' })

    } catch (error) {
        console.log(error)
        return res.status(400).json({ message: 'Something went wrong.' });
    }
}

module.exports.postMoveDifferent = async (req, res, next) => {
    let { sourceColName, destColName,source,destination } = req.body
    sourceColName = sourceColName[0]
    destColName = destColName[0]
    const  kanbanId  = req.session.user.kanban
    try {
        if (!kanbanId) {
            return res.status(404).json({ message: 'Not Authorized to perform this action' })
        }
        if (!sourceColName|| !destColName || !source|| !destination) {
            return res.status(404).json({ message: 'Could not process your request' })
        }
        const kanban = await Kanban.findById(kanbanId)
        if (!kanban) {
            return res.status(404).json({ message: 'Request could not be processed' })
        }
        const sourceItems = [...kanban[sourceColName].tasks]
        const destinationItems = [...kanban[destColName].tasks]
        const [removed] = sourceItems.splice(source.index, 1)
        destinationItems.splice(destination.index, 0, removed)
        kanban[sourceColName].tasks = sourceItems
        kanban[destColName].tasks = destinationItems
        await kanban.save()
        return res.status(200).json({ message: 'Task Moved Successfully' })

    } catch (error) {
        console.log(error)
        return res.status(400).json({ message: 'Something went wrong.' });
    }

}

module.exports.postMoveSame = async (req, res, next) => {
    let { colName, source,destination } = req.body
    colName = colName[0]
    const  kanbanId  = req.session.user.kanban
    try {
        if (!kanbanId) {
            return res.status(404).json({ message: 'Not Authorized to perform this action' })
        }
        if (!colName || !source || !destination) {
            return res.status(404).json({ message: 'Could not process your request' })
        }
        const kanban = await Kanban.findById(kanbanId)
        if (!kanban) {
            return res.status(404).json({ message: 'Request could not be processed' })
        }
        const column = kanban[colName]
        const copiedItems = [...column.tasks]
        const [removed] = copiedItems.splice(source.index, 1)
        copiedItems.splice(destination.index, 0, removed)
        kanban[colName].tasks = copiedItems
        await kanban.save()
        return res.status(200).json({ message: 'Task Moved Successfully' })

    } catch (error) {
        console.log(error)
        return res.status(400).json({ message: 'Something went wrong.' });
    }
}

