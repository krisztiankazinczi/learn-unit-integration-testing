const httpMock = require('node-mocks-http');
const employeeController = require('../../controllers/employee.controller');
const employeeModel = require('../../models/employee.model');
const mockEmployees = require('../mockData/employees');

employeeModel.findByIdAndDelete = jest.fn();

let req, res, next;

beforeEach(() => {
  employeeModel.findByIdAndDelete.mockClear();
  req = httpMock.createRequest();
  req.params.id = mockEmployees[0]._id;
  res = httpMock.createResponse();
  next = null;
});

describe('employeeController.deleteEmployeeById', () => {
  test('deleteEmployeeById function is defined', () => {
    expect(typeof employeeController.deleteEmployeeById).toBe('function');
  });

  test('delete an existing employee', async () => {
    employeeModel.findByIdAndDelete.mockResolvedValue(mockEmployees[0]);
    await employeeController.deleteEmployeeById(req, res, next);
    expect(employeeModel.findByIdAndDelete).toHaveBeenCalledWith(
      mockEmployees[0]._id
    );
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toStrictEqual(mockEmployees[0]);
  });

  test('return 404 when id not existing in database', async () => {
    employeeModel.findByIdAndDelete.mockResolvedValue(null);
    await employeeController.deleteEmployeeById(req, res, next);
    expect(res.statusCode).toEqual(404);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res._getJSONData()).toStrictEqual('User not found');
  });

  // test('return 500 when findByIdAndDelete throws error', async () => {
  //   employeeModel.findByIdAndDelete.mockRejectedValue("Fake database error");
  //   await employeeController.deleteEmployeeById(req, res, next);
  //   expect(res.statusCode).toEqual(500);
  //   expect(res._getData()).toStrictEqual("Fake database error");
  // });
});
