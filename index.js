const { app, sequelize } = require("./app");

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
