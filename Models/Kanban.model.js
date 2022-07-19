const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require('uuid');


const kanbanModel = new Schema({
    todo: {
        id:{ type: String,default:uuidv4() },
        columnName:{ type: String, default:'To Do'},
        tasks: [{
            name:{type:String},
            id:{type:String},
            startDate: {type:Date}
        }]
    },
    inProgress: {
        id:{ type: String,default:uuidv4() },
        columnName:{ type: String, default:'In Progress'},
        tasks: [{
            id:{type:String},
            name:{type:String},
            startDate: {type:Date}
        }]
    },
    completed: {
        id:{ type: String,default:uuidv4() },
        columnName:{ type: String, default:'Completed'},
        tasks: [{
            name:{type:String},
            id:{type:String},
            startDate: {type:Date}
        }]
    },
});



module.exports = mongoose.model(
    'kanban',
    kanbanModel
);