const httpMock = require('node-mocks-http');
const controller = require('../../controllers/employee.controller');
const model = require('../../models/employee.model');
const mockEmployees = require('../mockData/employees');

model.findById = jest.fn(); //this mocks the findById mongoose function and returns undefined

let req, res, next;

// It will restore these object to the original value before each test. Without this in the second or third test the req and res object would not be empty req, res objects.
beforeEach(() => {
  req = httpMock.createRequest();
  res = httpMock.createResponse();
  next = null;
});

afterEach(() => {
  model.findById.mockClear();
});

describe('controller.getEmployeeById', () => {
  test('getEmployeeById function is defined', () => {
    expect(typeof controller.getEmployeeById).toBe('function');
  });

  test('return an employee by id', async () => {
    req.params.id = mockEmployees[0]._id;
    model.findById.mockReturnValue(mockEmployees[0]);
    await controller.getEmployeeById(req, res, next);

    expect(model.findById).toHaveBeenCalled();
    expect(model.findById).toHaveBeenCalledWith(req.params.id);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(mockEmployees[0]);
  });

  test('return 404 when id not found', async () => {
    req.params.id = mockEmployees[0]._id; // this have to be here, or the toHaveBeenCalledWith arguments should be null or udnefined
    model.findById.mockReturnValue(null);
    await controller.getEmployeeById(req, res, next);
    expect(model.findById).toHaveBeenCalledWith(req.params.id);
    expect(res.statusCode).toBe(404);
  });

  test('return 500 when model.findById throws exception', async () => {
    req.params.id = mockEmployees[0]._id;
    model.findById.mockRejectedValue('fake exception from findById');
    await controller.getEmployeeById(req, res, next);
    expect(model.findById).toHaveBeenCalledWith(req.params.id);
    expect(res.statusCode).toBe(500);
    expect(res._getData()).toEqual('fake exception from findById');
  });
});

/*
httpMock package:
if res.send("foo") => I can get the res.send info with res._getData()
if res.json({"foo": "foo"}) => I can get the res.json info with res._getJSONData()
*/

describe("employeeController.getAllEmployees", () => {
  
})
