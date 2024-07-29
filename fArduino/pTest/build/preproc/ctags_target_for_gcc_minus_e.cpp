# 1 "C:\\Users\\samue\\Documents\\GithubProjects\\Plantifier\\fArduino\\pTest\\pTest.ino"
// Moisture Sensor Arduino Code
// By Circuitdigest




void setup() {
  Serial.begin(9600);
  pinMode(6, 0x1);
  digitalWrite(6, 0x0);
}

void loop() {
  int moisturePercentage = readSensor();
  Serial.print("Moisture: ");
  Serial.print(moisturePercentage);
  Serial.println("%");
  delay(500);
}

// This function returns the moisture percentage to the calling function
int readSensor() {
  int sensorValue = analogRead(A0); // Read the analog value from sensor
  int moisturePercentage = map(sensorValue, 0, 1023, 0, 100); // map the 10-bit data to percentage (0 - 100)
  int outputValue = map(sensorValue, 0, 1023, 0, 255); // map the 10-bit data to 8-bit data for PWM
  analogWrite(6, outputValue); // generate PWM signal
  return moisturePercentage; // Return moisture percentage
}
