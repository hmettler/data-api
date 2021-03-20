const express = require("express");
const { Sequelize, DataTypes } = require("sequelize");
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

const app = express();
app.use(express.json());

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
