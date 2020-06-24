const httpMock = require('node-mocks-http');
const employeeController = require('../../controllers/employee.controller');
const employeeModel = require('../../models/employee.model');
const mockEmployees = require('../mockData/employees');

employeeModel.findByIdAndUpdate = jest.fn();

let req, res, next;

beforeEach(() => {
  req = httpMock.createRequest();
  res = httpMock.createResponse();
  next = null;
});

afterEach(() => {
  employeeModel.findByIdAndUpdate.mockClear();
});

describe('employeeController.updateEmployeeById', () => {
  test('updateEmployeeById function is defined', () => {
    expect(typeof employeeController.updateEmployeeById).toBe('function');
  });

  test('update existing employee with phone number', async () => {
    const update = { ...mockEmployees[0], phone: '+36204703876' };
    req.params.id = mockEmployees[0]._id;
    req.body = { ...update };
    employeeModel.findByIdAndUpdate.mockReturnValue(update);
    await employeeController.updateEmployeeById(req, res, next);
    expect(employeeModel.findByIdAndUpdate).toHaveBeenCalledWith(
      req.params.id,
      req.body,
      {
        useFindAndModify: false
      }
    );
    expect(res.statusCode).toEqual(201);
    expect(res._getJSONData()).toStrictEqual(update);
  });

  test('return 400 when id not existing', async () => {
    employeeModel.findByIdAndUpdate.mockReturnValue(null);
    await employeeController.updateEmployeeById(req, res, next);
    expect(res.statusCode).toEqual(400);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res._getData()).toBeNull;
  });

  test('return 500 when findByIdAndUpdate throws error', async () => {
    employeeModel.findByIdAndUpdate.mockRejectedValue('fake exception from findByIdAndUpdate');
    await employeeController.updateEmployeeById(req, res, next);
    expect(res.statusCode).toEqual(500);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res._getJSONData()).toStrictEqual('fake exception from findByIdAndUpdate');
  });

});
