#include <Arduino.h>
#line 1 "C:\\Users\\samue\\Documents\\GithubProjects\\Plantifier\\fArduino\\pTest\\pTest.ino"
// Moisture Sensor Arduino Code
// By Circuitdigest

#define ledPin 6
#define sensorPin A0

#line 7 "C:\\Users\\samue\\Documents\\GithubProjects\\Plantifier\\fArduino\\pTest\\pTest.ino"
void setup();
#line 13 "C:\\Users\\samue\\Documents\\GithubProjects\\Plantifier\\fArduino\\pTest\\pTest.ino"
void loop();
#line 22 "C:\\Users\\samue\\Documents\\GithubProjects\\Plantifier\\fArduino\\pTest\\pTest.ino"
int readSensor();
#line 7 "C:\\Users\\samue\\Documents\\GithubProjects\\Plantifier\\fArduino\\pTest\\pTest.ino"
void setup() {
  Serial.begin(9600);
  pinMode(ledPin, OUTPUT);
  digitalWrite(ledPin, LOW);
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
  int sensorValue = analogRead(sensorPin); // Read the analog value from sensor
  int moisturePercentage = map(sensorValue, 0, 1023, 0, 100); // map the 10-bit data to percentage (0 - 100)
  int outputValue = map(sensorValue, 0, 1023, 0, 255); // map the 10-bit data to 8-bit data for PWM
  analogWrite(ledPin, outputValue); // generate PWM signal
  return moisturePercentage; // Return moisture percentage
}

