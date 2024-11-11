const express = require("express");
const { addFoodMenu, fetchAllMenu, fetchSingleMenuItem, deleteFoodItem, updateFoodItem} = require("../controller/admin-menu-controller");
const { verifyLoginAdminToken } = require("../controller/admin-auth-controller");
const { menuImgUpload } = require("../utils/files");
const router = express.Router();

router.post(
  "/add-food-menu",
  verifyLoginAdminToken,
  menuImgUpload,
  addFoodMenu
);
router.put(
  "/update-food-menu/:id",
  verifyLoginAdminToken,
  menuImgUpload,
  updateFoodItem
);


router.get("/all-food-menu", verifyLoginAdminToken, fetchAllMenu);
router.get("/single-food-menu/:id", fetchSingleMenuItem);
router.delete("/delete-food-menu/:id", verifyLoginAdminToken, deleteFoodItem);


module.exports = router;
