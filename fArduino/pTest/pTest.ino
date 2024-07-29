#include <DHT.h> // Include the correct DHT library
#define DHTTYPE DHT11 // Define the DHT type as DHT11
#define DHT11_PIN 5 // Define the DHT pin
DHT dht(DHT11_PIN, DHTTYPE);

#define ledPin 6
#define sensorPin A0

void setup() {
  Serial.begin(9600);
  pinMode(ledPin, OUTPUT);
  digitalWrite(ledPin, LOW);
  dht.begin(); // Initialize the DHT sensor
}

void loop() {
  // Read moisture data
  int moisturePercentage = readSensor();

  // Read temperature and humidity data
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();

  if (isnan(temperature) || isnan(humidity)) {
    Serial.println("Failed to read from DHT sensor!");
  } else {
    // Send moisture, temperature, and humidity data as a single string
    Serial.print(moisturePercentage);
    Serial.print(",");
    Serial.print(temperature);
    Serial.print(",");
    Serial.println(humidity);
  }

  delay(2000); // Update every 2 seconds
}

// This function returns the moisture percentage to the calling function
int readSensor() {
  int sensorValue = analogRead(sensorPin); // Read the analog value from sensor
  int moisturePercentage = map(sensorValue, 0, 1023, 0, 100); // Map the 10-bit data to percentage (0 - 100)
  int outputValue = map(sensorValue, 0, 1023, 0, 255); // Map the 10-bit data to 8-bit data for PWM
  analogWrite(ledPin, outputValue); // Generate PWM signal
  return moisturePercentage; // Return moisture percentage
}
