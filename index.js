require('dotenv').config();

const express = require("express");
const cors = require('cors');
const bodyParser = require('body-parser');

const connectToDB = require('./connection');

const authMiddleware = require('./middleware/authMiddleware');
const modelRoutes = require("./routes/models");

const app = express();
const PORT = process.env.PORT || 8000;

connectToDB(process.env.MONGODB_URL)
.then(() => {
    console.log("MongoDB Connected");
});

app.use(cors());
app.use('/api/webhook', express.raw({ type: 'application/json' }));

app.use(express.json());
app.use(bodyParser.json());

app.use(authMiddleware);

app.use("/api", modelRoutes);

app.listen(PORT, () => { console.log(`Server started on PORT:${PORT}`) });
