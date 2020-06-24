const httpMock = require('node-mocks-http');
const employeeController = require('../../controllers/employee.controller');
const employeeModel = require('../../models/employee.model');
const mockEmployees = require('../mockData/employees');

employeeModel.find = jest.fn();

let req, res, next;

beforeEach(() => {
  req = httpMock.createRequest();
  res = httpMock.createResponse();
  next = null;
});

afterEach(() => {
  employeeModel.find.mockClear();
});

describe('employeeController.getAllEmployees', () => {
  test('getAllEmployees function is defined', () => {
    expect(typeof employeeController.getAllEmployees).toBe('function');
  });

  test('return all employees', async () => {
    employeeModel.find.mockReturnValue(mockEmployees);
    await employeeController.getAllEmployees(req, res, next);

    expect(employeeModel.find).toHaveBeenCalled();
    expect(employeeModel.find).toHaveBeenCalledWith({});
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(mockEmployees);
  });

  test('return 404 if database collection is empty', async () => {
    employeeModel.find.mockReturnValue([]);
    await employeeController.getAllEmployees(req, res, next);

    expect(employeeModel.find).toHaveBeenCalledWith({});
    expect(res.statusCode).toBe(404);
  });

  test('return 500 if employeeModel.find throws an error', async () => {
    employeeModel.find.mockRejectedValue('fake exception from find');
    await employeeController.getAllEmployees(req, res, next);

    expect(employeeModel.find).toHaveBeenCalledWith({});
    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toStrictEqual('fake exception from find');
  });
});
