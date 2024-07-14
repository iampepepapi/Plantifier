#include <Arduino.h>
#line 1 "C:\\Users\\samue\\Documents\\GithubProjects\\Plantifier\\fArduino\\pPlantifier\\pPlantifier.ino"
#include "DHTStable.h"

DHTStable DHT;

#define DHT11_PIN 7


#line 8 "C:\\Users\\samue\\Documents\\GithubProjects\\Plantifier\\fArduino\\pPlantifier\\pPlantifier.ino"
void setup();
#line 19 "C:\\Users\\samue\\Documents\\GithubProjects\\Plantifier\\fArduino\\pPlantifier\\pPlantifier.ino"
void loop();
#line 8 "C:\\Users\\samue\\Documents\\GithubProjects\\Plantifier\\fArduino\\pPlantifier\\pPlantifier.ino"
void setup()
{
  Serial.begin(9600);
  Serial.println(__FILE__);
  Serial.print("LIBRARY VERSION: ");
  Serial.println(DHTSTABLE_LIB_VERSION);
  Serial.println();
  Serial.println("Type,\tstatus,\tHumidity (%),\tTemperature (C)");
}


void loop()
{
  // READ DATA
  Serial.print("DHT11, \t");
  int chk = DHT.read11(DHT11_PIN);
  switch (chk)
  {
    case DHTLIB_OK:  
      Serial.print("OK,\t"); 
      break;
    case DHTLIB_ERROR_CHECKSUM: 
      Serial.print("Checksum error,\t"); 
      break;
    case DHTLIB_ERROR_TIMEOUT: 
      Serial.print("Time out error,\t"); 
      break;
    default: 
      Serial.print("Unknown error,\t"); 
      break;
  }
  // DISPLAY DATA
  Serial.print(DHT.getHumidity(), 1);
  Serial.print(",\t");
  Serial.println(DHT.getTemperature(), 1);

  delay(2000);
}
