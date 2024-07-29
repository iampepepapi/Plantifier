const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");
const express = require("express");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"],
        credentials: true,
    },
});

app.use(
    cors({
        origin: "http://localhost:3000",
    })
);

const portPath = "COM6";

let serialConnectionEstablished = false;
let port;
let parser;

const initializeSerialPort = () => {
    if (port) {
        port.close(() => {
            console.log("Serial port closed");
        });
    }

    port = new SerialPort({ path: portPath, baudRate: 9600 });
    parser = port.pipe(new ReadlineParser({ delimiter: "\r\n" }));

    parser.on("data", (data) => {
        const values = data.split(",");
        if (values.length === 3) {
            latestMoistureValue = parseInt(values[0], 10);
            latestTemperature = parseFloat(values[1]);
            latestHumidity = parseFloat(values[2]);
            console.log(
                `Moisture: ${latestMoistureValue}%, Temperature: ${latestTemperature} *C, Humidity: ${latestHumidity} %`
            );
            serialConnectionEstablished = true;
            io.emit("serialStatus", "connected");
        }
    });

    port.on("error", (err) => {
        console.log("Serial port error: ", err.message);
        serialConnectionEstablished = false;
        io.emit("serialStatus", "disconnected");
        // Retry connection after 5 seconds
        setTimeout(initializeSerialPort, 5000);
    });

    port.on("close", () => {
        console.log("Serial port closed");
        serialConnectionEstablished = false;
        io.emit("serialStatus", "disconnected");
    });
};

// Variables to store the latest sensor values
let latestMoistureValue = null;
let latestTemperature = null;
let latestHumidity = null;

// Initialize the serial port on startup
initializeSerialPort();

// Emit the sensor data every 2 seconds
setInterval(() => {
    if (
        serialConnectionEstablished &&
        latestMoistureValue !== null &&
        latestTemperature !== null &&
        latestHumidity !== null
    ) {
        io.emit("sensorData", {
            moisture: latestMoistureValue,
            temperature: latestTemperature,
            humidity: latestHumidity,
        });
    }
}, 2000);

// Endpoint to refresh the serial connection
app.get("/refresh-connection", (req, res) => {
    initializeSerialPort();
    res.send("Serial port connection refreshed");
});

// Serve the index.html file
app.use(express.static(path.join(__dirname, "/")));

io.on("connection", (socket) => {
    console.log("Client connected");

    // Send the latest sensor data to newly connected clients
    if (
        latestMoistureValue !== null &&
        latestTemperature !== null &&
        latestHumidity !== null
    ) {
        socket.emit("sensorData", {
            moisture: latestMoistureValue,
            temperature: latestTemperature,
            humidity: latestHumidity,
        });
    }

    // Send the current serial connection status to the newly connected client
    socket.emit(
        "serialStatus",
        serialConnectionEstablished ? "connected" : "disconnected"
    );
});

server.listen(3001, () => {
    console.log("Server listening on port 3001");
});
