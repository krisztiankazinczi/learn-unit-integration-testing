const employeeController = require('../../controllers/employee.controller');
const employeeModel = require('../../models/employee.model');
const bcrypt = require('bcrypt');
const httpMock = require('node-mocks-http');
const jwt = require('jsonwebtoken');
const mockEmployee = require('../mockdata/employeeReq.json');

employeeModel.findOne = jest.fn();
bcrypt.compare = jest.fn();
jwt.sign = jest.fn();
let req, res, next;

beforeEach(() => {
  employeeModel.findOne.mockClear();
  bcrypt.compare.mockClear();
  jwt.sign.mockClear();
  req = httpMock.createRequest();
  res = httpMock.createResponse();
  next = null;
  // if you set req.body =mockEmployee,  it fails as reference value is getting changed
  req.body = { ...mockEmployee };
});


describe('employeeController.login', () => {
  test('login function is defined', () => {
    expect(typeof employeeController.login).toBe('function');
  });

  test('login from a valid employee', async () => {
    employeeModel.findOne.mockReturnValue(mockEmployee);
    bcrypt.compare.mockReturnValue(true);
    jwt.sign.mockReturnValue('fakejwttoken');
    await employeeController.login(req, res, next);
    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toStrictEqual(mockEmployee);
    expect(res._getHeaders()['auth-token']).toStrictEqual('fakejwttoken');
  });

  test('login from a valid employee but wrong password', async () => {
    employeeModel.findOne.mockReturnValue(mockEmployee);
    bcrypt.compare.mockReturnValue(false);
    await employeeController.login(req, res, next);
    expect(res.statusCode).toBe(400);
    expect(res._getData()).toStrictEqual(
      'you provided an invalid password , please try again'
    );
  });

  test('login from a valid employee but jwt sign fails', async () => {
    employeeModel.findOne.mockReturnValue(mockEmployee);
    bcrypt.compare.mockReturnValue(true);
    jwt.sign.mockRejectedValue('fake jwt sign exception');
    await employeeController.login(req, res, next);
    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toStrictEqual('fake jwt sign exception');
    expect(res._getHeaders()['auth-token']).toBeUndefined;
  });

  test('login from a employee when password validation fails', async () => {
    employeeModel.findOne.mockReturnValue(mockEmployee);
    bcrypt.compare.mockRejectedValue('fake password validation exception');
    await employeeController.login(req, res, next);
    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toStrictEqual(
      'fake password validation exception'
    );
    expect(res._getHeaders()['auth-token']).toBeUndefined;
  });

  test('login from a employee when not registered already with provided email', async () => {
    employeeModel.findOne.mockReturnValue(null);
    await employeeController.login(req, res, next);
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toStrictEqual(
      'Email you provided doesnt exist in our database'
    );
  });
});
