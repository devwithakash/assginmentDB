const router = require("express").Router();
const auth = require("../middleware/auth");
const taskController = require("../controllers/taskController"); // Import the controller


router.post("/", auth, taskController.addTask);
router.get("/", auth, taskController.getTasks);
router.get("/summary/status", auth, taskController.getTaskSummary);
router.get("/recent", auth, taskController.getRecentTasks); // 🆕 Added this
router.get("/:id", auth, taskController.getTaskById);
router.put("/:id", auth, taskController.updateTask);
router.delete("/:id", auth, taskController.deleteTask);

module.exports = router;