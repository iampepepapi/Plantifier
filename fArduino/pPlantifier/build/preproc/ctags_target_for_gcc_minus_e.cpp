# 1 "C:\\Users\\samue\\Documents\\GithubProjects\\Plantifier\\fArduino\\pPlantifier\\pPlantifier.ino"
# 2 "C:\\Users\\samue\\Documents\\GithubProjects\\Plantifier\\fArduino\\pPlantifier\\pPlantifier.ino" 2

DHTStable DHT;




void setup()
{
  Serial.begin(9600);
  Serial.println("C:\\Users\\samue\\Documents\\GithubProjects\\Plantifier\\fArduino\\pPlantifier\\pPlantifier.ino");
  Serial.print("LIBRARY VERSION: ");
  Serial.println(((reinterpret_cast<const __FlashStringHelper *>(
# 13 "C:\\Users\\samue\\Documents\\GithubProjects\\Plantifier\\fArduino\\pPlantifier\\pPlantifier.ino" 3
                (__extension__({static const char __c[] __attribute__((__progmem__)) = (
# 13 "C:\\Users\\samue\\Documents\\GithubProjects\\Plantifier\\fArduino\\pPlantifier\\pPlantifier.ino"
                "1.1.0 - DHTStable"
# 13 "C:\\Users\\samue\\Documents\\GithubProjects\\Plantifier\\fArduino\\pPlantifier\\pPlantifier.ino" 3
                ); &__c[0];}))
# 13 "C:\\Users\\samue\\Documents\\GithubProjects\\Plantifier\\fArduino\\pPlantifier\\pPlantifier.ino"
                ))));
  Serial.println();
  Serial.println("Type,\tstatus,\tHumidity (%),\tTemperature (C)");
}


void loop()
{
  // READ DATA
  Serial.print("DHT11, \t");
  int chk = DHT.read11(7);
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
