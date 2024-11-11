const multer = require("multer");
const path = require("path");

const menuStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/files/imgs/menus");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.originalname.replace(/[^a-zA-Z0-9_.,]/g, "") +
        "_" +
        Date.now() +
        path.extname(file.originalname)
    );
  },
});
const menuUpload = multer({ storage: menuStorage });
const menuImgUpload = menuUpload.fields([
  { name: "item_image", maxCount: 1 },
  //   { name: "images", maxCount: 5 },
]);

module.exports = {
  menuImgUpload,
};




