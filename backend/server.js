const express = require("express");
const routes = require("./src/routes.js");
const path = require("path");

const app = express();
const port = 5000;

const cors = require("cors");

app.use(cors("*"));
app.use("/api", routes);
app.use('/videos/hls', express.static(path.join(__dirname, 'videos')));

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
