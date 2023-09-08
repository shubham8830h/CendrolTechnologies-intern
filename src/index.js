const express = require("express");
const app = express();
const Db_connect = require("./config/database");
const router = require("./route/route");
const fileUpload = require("express-fileupload");
const { cloudinaryConnect } = require("./config/cloudinary");
const dotEnv = require("dotenv");

dotEnv.config();
app.use(express.json());
app.use(
  fileUpload({
    // Store in temp and generate a url accordingly
    useTempFiles: true,
    tempFileDir: "/tmp",
  })
);

//cloudinary connection
cloudinaryConnect();

Db_connect.connect();

app.use("/", router);

const port = 3000;
app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
