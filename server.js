
import express from "express";
import connectDatabase from "./config/database.js";
import cors from "cors";
import userRoute from "./routes/userRoute.js";
import orderRoute from "./routes/orderRoute.js";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true })
);
const corsOptions = {
  origin: ["http://localhost:5173", "https://dev.replicacopyindustries.com"], 
  
};

app.use(cors(corsOptions));
connectDatabase();
app.get("/", (req, res) => {
    res.send("RCI backend is running...");
});
app.use("/api/users", userRoute);
app.use("/api/orders", orderRoute);

const PORT = process.env.PORT || 5500;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));




// ityk nrre duin yolo