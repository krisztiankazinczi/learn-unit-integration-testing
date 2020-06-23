const employeeModel = require('../models/employee.model');
const joi = require('@hapi/joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const saltRounds = 12;

const schema = joi.object({
  name: joi
    .string()
    .alphanum()
    .min(3)
    .max(30)
    .required(),
  email: joi
    .string()
    .required()
    .email(),
  password: joi
    .string()
    .min(6)
    .max(20)
    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
    .required(),
  gender: joi.string(),
  phone: joi.string()
});

exports.createEmployee = async (req, res, next) => {
  try {
    const checkBody = await schema.validate(req.body);
    console.log(`Validation result: ${checkBody}`);
    if (checkBody.error) {
      return res.status(400).json(checkBody.error);
    }

    const doEmailExist = await employeeModel.findOne({ email: req.body.email });
    console.log('doEmailExist :', doEmailExist);
    if (doEmailExist) {
      return res
        .status(400)
        .json('Email you provided already exist in our database');
    }

    const salt = await bcrypt.genSalt(saltRounds);
    const encryptedPassword = await bcrypt.hash(req.body.password, salt);
    console.log(encryptedPassword);
    req.body.password = encryptedPassword;

    const newEmployee = await employeeModel.create(req.body);
    console.log(newEmployee);
    res.status(201).json(newEmployee);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

exports.getAllEmployees = async (req, res, next) => {
  try {
    const allEmployees = await employeeModel.find({});
    console.log(allEmployees);
    if (allEmployees && allEmployees.length) {
      res.status(200).json(allEmployees);
    } else {
      res.status(404).json();
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.getEmployeeById = async (req, res, next) => {
  try {
    const employee = await employeeModel.findById(req.params.id);
    if (employee) {
      res.status(200).json(employee);
    } else {
      res.status(404).send();
    }
  } catch (error) {
    console.log('in catch', error);
    res.status(500).json(error);
  }
};

//using callback with mongoose
// exports.getEmployeeById = function (req, res, next) {
//     try {

//         employeeModel.findById(req.params.employee_id, function (err, employee) {
//             if (err)
//                 return res.send(err);
//             res.status(200).json(employee);
//         });
//     }
//     catch {
//         res.status(500).send(err);
//     }
// };

exports.updateEmployeeById = async (req, res, next) => {
  try {
    const updatedEmployee = await employeeModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        // without this mongoose would throw an error
        useFindAndModify: false
      }
    );

    if (updatedEmployee) {
      res.status(201).json(updatedEmployee);
    } else {
      res.status(400).send();
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

exports.deleteEmployeeById = async (req, res, next) => {
  employeeModel
    .findByIdAndDelete(req.params.id)
    .then(resp => {
      if (resp) {
        console.log(resp);
        res.status(200).json(resp);
      } else {
        console.log('User is not listed in database');
        res.status(404).json('User not found');
      }
    })
    .catch(err => res.status(500).send(err));
};

exports.login = async (req, res, next) => {
  try {
    const joiCheck = await schema.validate(req.body);
    if (joiCheck.error) return res.status(400).json(joiCheck.error);
    const employee = await employeeModel.findOne({ email: req.body.email });
    console.log(employee);
    if (!employee) {
      return res
        .status(400)
        .json('Email you provided doesnt exist in our database');
    }
    const validatePassword = await bcrypt.compare(
      req.body.password,
      employee.password
    );
    console.log('Password Validation: ', validatePassword);
    if (!validatePassword)
      return res
        .status(400)
        .send('you provided an invalid password , please try again');
    const jwtToken = await jwt.sign(
      {
        data: employee
      },
      process.env.JWT_TOKEN_KEY,
      { expiresIn: '1h' }
    );
    console.log(jwtToken);
    res.header('auth-token', jwtToken);
    res.status(201).json(employee);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
