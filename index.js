const express = require("express");
const { Sequelize, DataTypes } = require("sequelize");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit")

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    /*
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
    */
})

const SensorData = sequelize.define("sendor-data", {
    serial: {
        type: DataTypes.STRING,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    temperature: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
})

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,    // 1 minute
    max: 10                    // Limit each IP to 10 requests per windoMs
})

const app = express();
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(limiter);


//const dataList = [];

app.get("/data", async (req, res) => {
    //res.status(200).send(dataList);
    const allData = await SensorData.findAll();
    res.status(200).send(allData);
    return;
});

app.post("/data",  async (req, res) => {
    let data = req.body;
    /*
    dataList.push(data)
    res.status(201).send(dataList);
    */
    const sensorData = await SensorData.create(data);
    res.status(201).send(sensorData);
    return;
});

app.listen({ port: 8080}, () => {
    try {
        sequelize.authenticate();
        console.log("Connected to database");
        sequelize.sync({ alter: true});
        console.log("Sync database");
    } catch(error) {
        console.log("Could not connect to the database", error);
    }
    console.log("Server is running");
});
