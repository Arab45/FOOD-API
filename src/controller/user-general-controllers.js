const { isValidObjectId } = require("mongoose");
const Menu = require("../models/Menu");
const Order = require("../models/Order");
const { sendTryCtachError, sendSuccess, sendError } = require("../middleware/index");

// When the item name and price is supplied by the frontend(payload)
// const makeOrder = async (req, res, next) => {
//   const userId = req.userId;
//   const { orders } = req.body;

//   let title = [];
//   let refinedOrders = [];
//   let order_total_price = 0;

//   orders.forEach((element) => {
//     title.push(element.item_name);

//     const item_id = element.item_id;
//     const item_name = element.item_name;
//     const item_price = Number(element.item_price);
//     const item_quantity = Number(element.item_quantity);
//     const item_total_price = item_price * item_quantity;
//     order_total_price += item_total_price;

//     const item = {
//       item_id,
//       item_name,
//       item_price,
//       item_quantity,
//       item_total_price,
//     };
//     refinedOrders.push(item);
//   });

//   title = title.join(" + ");
//   const order_title = `Order for ${title}`;
//   console.log("order_title", order_title);
//   console.log("refinedOrders", refinedOrders);
//   console.log("order_total_price", order_total_price);
//   try {
//     const newOrder = new Order({
//       owner: userId,
//       order_title: order_title,
//       orders: refinedOrders,
//       order_total_price,
//     });
//     await newOrder.save();
//     return sendSuccess(
//       res,
//       "Your order has been completed. Delivery is on the way",
//       newOrder
//     );
//     // next();
//   } catch (error) {
//     return sendTryCtachError(res, error);
//   }
// };

// When th manu name and price are not provided
const makeOrder = async (req, res, next) => {
  const userId = req.userId;
  const { orders } = req.body;

  let title = [];
  let refinedOrders = [];
  let order_total_price = 0;

  orders.forEach(async (element) => {
    if (!isValidObjectId(element.item_id)) {
      return sendError(
        res,
        "One or more of the ordered items is invalid.",
        400
      );
    };

    // const it = await Menu.findById(element.item_id);
    // console.log("it", it);
    // if (!it) {
    //   return sendError(
    //     res,
    //     "One or more of the items order no longer exists. Please refresh the page",
    //     400
    //   );
    // }

    const item_name = element.item_name;
    const item_price = Number(element.item_price);
    const item_quantity = Number(element.item_quantity);
    const item_total_price = item_price * item_quantity;
    order_total_price += item_total_price;
    title.push(item_name);

    const item = {
      item_id: element.item_id,
      item_name,
      item_price,
      item_quantity,
      item_total_price,
    };
    refinedOrders.push(item);
  });

  title = title.join(" + ");
  const order_title = `Order for ${title}`;
  console.log("order_title", order_title);
  console.log("refinedOrders", refinedOrders);
  console.log("order_total_price", order_total_price);

  // setTimeout(async () => {
  //   title = title.join(" + ");
  //   const order_title = `Order for ${title}`;
  //   console.log("order_title", order_title);
  //   console.log("refinedOrders", refinedOrders);
  //   console.log("order_total_price", order_total_price);
    try {
      const newOrder = new Order({
        owner: userId,
        order_title: order_title,
        orders: refinedOrders,
        order_total_price,
      });
      await newOrder.save();
      return sendSuccess(
        res,
        "Your order has been completed. Delivery is on the way",
        newOrder
      );
      // next();
    } catch (error) {
      return sendTryCtachError(res, error);
    }
  // }, 100);
};

const fetchAllOrder = async (req, res) => {
  try {
    const orders = await Order.find();
    return sendSuccess(res, "Successfully fetch all orders", orders);
  } catch (error) {
    return sendTryCtachError(res, error);
  }
};

const fetchSingleOrder = async (req, res) => {
  const { id } = req.params;

  if(!isValidObjectId(id)){
    return sendError(res, "Invalid Id provided");
  };


  try {
    const data = await Order.findById(id);
    if(!data){
      return sendError(res, "Unable to detect user id");
    };
    return sendSuccess(res, "Successfully fetch single order", data);
  } catch (error) {
    return sendTryCtachError(res, error);
  }
}

module.exports = {
  makeOrder,
  fetchAllOrder,
  fetchSingleOrder
};
