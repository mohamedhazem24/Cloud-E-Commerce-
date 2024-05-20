const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");

"backend_nodejs"
require("dotenv/config");

//middleware
app.use(bodyparser.json());
app.use(morgan("tiny"));

//Routers
const categoriesRoutes = require("./routers/categories");
const productsRoutes = require("./routers/products");
const usersRoutes = require("./routers/users");
const orderRoutes = require("./routers/orders");

const api = process.env.API_URL;

app.use(api + "/categories", categoriesRoutes);
app.use(api + "/products", productsRoutes);
app.use(api + "/users", usersRoutes);
app.use(api + "/orders", orderRoutes);

mongoose
  .connect(process.env.CONNECTION_STRING, {
    dbName: "eshop-database",
  })
  .then(() => {
    console.log("Database Connection is ready...");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(3100, () => {
  console.log(api);
  console.log("server is running on http://localhost:3100");
});
