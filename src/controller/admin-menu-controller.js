const { isValidObjectId } = require("mongoose");
const Admin = require("../models/Admin");
const Menu = require("../models/Menu");
const { sendError, sendSuccess, sendTryCtachError } = require("../middleware/index");

const addFoodMenu = async (req, res) => {
  const adminId = req.adminId;
  if (!req.files) {
    return sendError(res, "Menu cover image is missing");
  };
  const rawImageArray = req?.files["item_image"];
  const namedImage = rawImageArray.map((a) => a.filename);
  const stringnifiedImage = JSON.stringify(namedImage);
  const formmatedImage = stringnifiedImage.replace(/[^a-zA-Z0-9_.,]/g, "");

  try {
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return sendError(res, "You are not authorised.");
    }
    req.body.added_by = admin.username;
    req.body.item_image = formmatedImage;
    try {
      const newFood = new Menu({ ...req.body });
      await newFood.save();
      return sendSuccess(
        res,
        "Successfully added a new item to the menu",
        newFood
      );
    } catch (error) {
      return sendTryCtachError(res, error);
    }
  } catch (error) {
    return sendTryCtachError(res, error);
  }
};

const updateFoodItem = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  console.log("req.body", req.body);

  if (req.files) {
    const rawImageArray = req?.files["item_image"];
    if (rawImageArray) {
      const namedImage = rawImageArray.map((a) => a.filename);
      const stringnifiedImage = JSON.stringify(namedImage);
      const formmatedImage = stringnifiedImage.replace(/[^a-zA-Z0-9_.,]/g, "");
      req.body.item_image = formmatedImage;

      const currentMenuData = await Menu.findById(req.params.id);
      if (currentMenuData) {
        const fileToDelete = currentMenuData.item_image;
        // Handle file delete from disk by yourself
      }
    }
  }

  try {
    const updatedItem = await Menu.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );
    console.log("updatedItem", updatedItem);
    if (!updatedItem) {
      return sendError(res, "Unable to update the data. Data does not exist");
    }
    return sendSuccess(res, "Successfully updated the data", updatedItem);
  } catch (error) {
    return sendTryCtachError(res, error);
  }
};

const fetchAllMenu = async (req, res) => {
  try {
    const allFoods = await Menu.find();
    return sendSuccess(res, "Successfully fetched all menu", allFoods);
  } catch (error) {
    return sendTryCtachError(res, error);
  }
};

const fetchSingleMenuItem = async (req, res) => {
  const id = req.params.id;
  try {
    if (!isValidObjectId(id))
      return sendError(res, "Invalid object ID supplied");
    const item = await Menu.findById(id);
    console.log("item", item);
    if (!item) {
      return sendError(res, "Food item no longer exists");
    }
    return sendSuccess(res, "Successfully fetche dthe data", item);
  } catch (error) {
    return sendTryCtachError(res, error);
  }
};

const deleteFoodItem = async (req, res) => {
  try {
    const deletedItem = await Menu.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return sendError(res, "Unable to delete the item. Something went wrong");
    }
    return sendSuccess(res, "Successfully deleted the item");
  } catch (error) {
    return sendTryCtachError(res, error);
  }
};

module.exports = {
  addFoodMenu,
  fetchAllMenu,
  fetchSingleMenuItem,
  deleteFoodItem,
  updateFoodItem,
};
