const mongoose = require('mongoose');

const employeeSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 12
    },
    gender: { type: String }, 
    phone: {type: String }, 
    created_date: {
        type: Date,
        default: Date.now
    }
});

mongoose.pluralize(null); // without this mongoose would add an extra 's' letter to the collection name!!
const employeeModel = mongoose.model("employee_test", employeeSchema); // the collection will be created with this name
module.exports = employeeModel;