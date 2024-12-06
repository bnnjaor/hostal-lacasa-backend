import connectDb from "./db/connetc.js";
import app from "./app.js";

connectDb()
app.listen(3000);
console.log("server listening on port 3000");