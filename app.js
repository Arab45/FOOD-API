require('dotenv').config();
const express = require('express');
const { connectToDB } = require('./src/db/index');
const app = express();
const menuRouter = require('./src/router/admin-menu-route');
const userRouter = require('./src/router/user-router');
const adminRouter = require('./src/router/admin-route');
const userOrderRouter = require('./src/router/user-order-menu-route');

app.use(express.json());
app.use('/api/foodItems', menuRouter);
app.use('/api/user', userRouter);
app.use('/Admin', adminRouter);
app.use('/api/order', userOrderRouter);

app.listen(process.env.APP_PORT, () => {
    console.log(`server running on port ${process.env.APP_PORT}`);
    connectToDB();
});