let employeeController = require('../../controllers/employee.controller');
const employeeModel = require('../../models/employee.model');
const bcrypt = require('bcrypt');
const httpMock = require('node-mocks-http');
const mockEmployee = require('../mockdata/employeeReq.json');


employeeModel.create = jest.fn();
employeeModel.findOne = jest.fn();
bcrypt.hash = jest.fn();
bcrypt.genSalt = jest.fn();
employeeController.schema.validate = jest.fn();

let req, res, next;

beforeEach(() => {
  employeeModel.create.mockClear();
  employeeModel.findOne.mockClear();
  bcrypt.hash.mockClear();
  bcrypt.genSalt.mockClear();
  req = httpMock.createRequest();
  res = httpMock.createResponse();
  next = null;
  // if you set req.body =  . it fails as reference value is getting changed
  req.body = { ...mockEmployee };
});

describe('employeeController.createEmployee', () => {
  test('createEmployee function is defined', () => {
    expect(typeof employeeController.createEmployee).toBe('function');
  });

  test("joi validation results with error", async () => {
    employeeController.schema.validate.mockReturnValue({error: true})
    await employeeController.createEmployee(req, res, next);
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toStrictEqual(
      true
    );
  })

  test('create a valid employee', async () => {
    employeeController.schema.validate.mockReturnValue({})
    employeeModel.create.mockReturnValue(mockEmployee);
    employeeModel.findOne.mockReturnValue(false);
    bcrypt.hash.mockReturnValue('hash');
    bcrypt.genSalt.mockReturnValue(12);
    await employeeController.createEmployee(req, res, next);
    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toStrictEqual(mockEmployee);
    expect(employeeModel.create).toBeCalledWith({
      ...mockEmployee,
      password: 'hash'
    });
  });

  test('create employee which already exists', async () => {
    employeeController.schema.validate.mockReturnValue({})
    employeeModel.create.mockReturnValue(mockEmployee);
    employeeModel.findOne.mockReturnValue(true);
    await employeeController.createEmployee(req, res, next);
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toStrictEqual(
      'Email you provided already exist in our database'
    );
  });

  test('create a valid employee , but password hashing failed', async () => {
    employeeController.schema.validate.mockReturnValue({})
    employeeModel.create.mockReturnValue(mockEmployee);
    employeeModel.findOne.mockReturnValue(false);
    bcrypt.genSalt.mockReturnValue('DUMMY');
    bcrypt.hash.mockRejectedValue('hashing failed');
    await employeeController.createEmployee(req, res, next);
    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toStrictEqual('hashing failed');
  });
});
