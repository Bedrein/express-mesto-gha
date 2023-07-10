const router = require("express").Router();

const {
  createUser,
  getUser,
  getUsers,
  updateProfileInfo,
  updateAvatar,
} = require("../controllers/users");

router.post("/users", createUser);
router.get("/users", getUsers);
router.get("/users/:userId", getUser);
router.patch("/users/me", updateProfileInfo);
router.patch("/users/me/avatar", updateAvatar);

module.exports = router;
