const router = require('express').Router();

const employeeController = require('../controllers/employee.controller');
const verifyJWToken = require('../middlewares/jwt-verification-middleware');

router.get('/', (req, res) => {
  res.json({
    status: 'API is working',
    message: 'Employee route is working'
  });
});

router.post('/login', employeeController.login);

router.post('/createEmployee', employeeController.createEmployee);

router.get('/employees', employeeController.getAllEmployees);

router
  .route('/employee/:id')
  .get(employeeController.getEmployeeById)
  .put(verifyJWToken, employeeController.updateEmployeeById)
  .delete(employeeController.deleteEmployeeById);

module.exports = router;
