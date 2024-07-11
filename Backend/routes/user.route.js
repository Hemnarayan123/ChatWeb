import express from "express";
import {
  allUsers,
  login,
  logout,
  signup,
} from "../controller/user.controller.js";
import secureRoute from "../middleware/secureRoute.js";
import { upload } from "../middleware/multer.middleware.js";
const router = express.Router();

// router.post("/signup",upload.fields([
//   {
//       name: "avatar",
//       maxCount :1
//   },

// ]), signup);
router.post("/signup",upload.single('avatar'), signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/allusers", secureRoute, allUsers);

export default router;
