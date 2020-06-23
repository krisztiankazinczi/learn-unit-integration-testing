const router = require('express').Router();

router.get('/', (req, res) => {
  res.json({
    status: 'API is working',
    message: 'Employee route is working'
  });
});

module.exports = router;

