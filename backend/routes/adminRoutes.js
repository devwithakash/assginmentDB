const router = require("express").Router();
const auth = require("../middleware/auth");
const role = require("../middleware/roleMiddleware");
const adminController = require("../controllers/adminController");

router.get("/dashboard", auth, role, adminController.getDashboard);
router.get("/users", auth, role, adminController.getUsers);
router.get("/expenses", auth, role, adminController.getExpenses);
router.get("/tasks", auth, role, adminController.getTasks);

module.exports = router;
