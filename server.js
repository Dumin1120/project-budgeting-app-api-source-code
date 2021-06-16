const app = require("./app");

require("dotenv").config();

//Port
const PORT = process.env.PORT || 9001;

//Listen
app.listen(PORT, () => console.log("Listening on port:", PORT));
