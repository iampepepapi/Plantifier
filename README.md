# Plantifier

Plantifier is a real-time sensor data visualization tool designed to monitor the humidity and temperature around a plant. It helps remind you when to water the plant by providing live updates on the plant's moisture levels, as well as room temperature and humidity.

## Features

- **Real-time Data**: Continuously streams data from sensors to display live readings.
- **Visualization**: Displays data in a responsive area chart with gradient fill.
- **CSV Export**: Allows you to export the last 50 data points as a CSV file.
- **Reconnect Functionality**: Button to refresh and reconnect to the server if disconnected.

## Technologies Used

- **React**: Frontend framework for building the user interface.
- **Socket.io**: For real-time communication between the server and the client.
- **Recharts**: Library for building charts and visualizations.
- **TypeScript**: Strongly typed programming language for better code quality and maintenance.

## Getting Started

### Prerequisites

Make sure you have the following installed on your system:

- Node.js
- npm (Node Package Manager)

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/your-username/plantifier.git
   cd plantifier
   ```

2. **Install the dependencies:**
   ```sh
   npm install
   ```

3. **Start the development server:**
   ```sh
   npm run dev
   ```

4. **Run the backend server:**
   Ensure your backend server that emits the sensor data via Socket.io is running. You can use the provided example or set up your own.

### Configuration

Ensure your backend server URL is correctly set in the code:
```javascript
const newSocket = io("http://localhost:3001"); // Adjust the server URL as needed
```

## Usage

Once the development server is running, open your browser and navigate to `http://localhost:3000`. You should see the live sensor data visualized in an area chart.

- **Sensor Readings**: The current moisture, temperature, and humidity levels are displayed at the top.
- **Status Indicator**: Shows the current connection status to the server.
- **Export Data**: Click the "Export Data" button to download the last 50 data points as a CSV file.
- **Reconnect**: If the connection to the server is lost, use the "Refresh Connection" button to attempt a reconnection.

## File Structure

```plaintext
plantifier/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── chart.tsx
│   │   │   └── ...other components
│   ├── App.tsx
│   ├── index.tsx
│   └── ...other files
├── package.json
├── tsconfig.json
└── ...other configuration files
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request if you have any ideas or improvements.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Samuel Gonzalez - [samuel.iga03@gmail.com](samuel.iga03@gmail.com)
Patrick - [

Project Link: [https://github.com/iampepepapi/Plantifier](https://github.com/iampepepapi/Plantifier)
