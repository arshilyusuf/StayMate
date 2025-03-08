const express = require("express");
const userController = require("./../controllers/userController");
const authController = require("./../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/signup", authController.signup)
router.post("/login", authController.login)
router.post("/logout", authController.logout);
router.post("/update",protect,authController.uploadPhoto, authController.update)

router.get("/me", protect, async (req, res) => {
  res.status(200).json({ user: req.user });
});
router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);



module.exports = router;
