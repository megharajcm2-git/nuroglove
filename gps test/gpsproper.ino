#include <TinyGPS++.h>
#include <SoftwareSerial.h>

// Define RX and TX pins for SoftwareSerial
#define RXPin 4
#define TXPin 3

// Set baud rate for GPS module
#define GPSBaud 9600

// Create TinyGPS++ and SoftwareSerial objects
TinyGPSPlus gps;
SoftwareSerial gpsSerial(RXPin, TXPin);

void setup() {
  Serial.begin(9600);       // Initialize Serial Monitor
  gpsSerial.begin(GPSBaud); // Initialize GPS module
  
  Serial.println("GPS Module Test");
}

void loop() {
  // Read data from GPS module
  while (gpsSerial.available() > 0) {
    if (gps.encode(gpsSerial.read())) {
      displayGPSData(); // Call function to display GPS data
    }
  }

  // Handle missed or incomplete data
  if (millis() > 5000 && gps.charsProcessed() < 10) {
    Serial.println("No GPS data received: check wiring or connection.");
    delay(1000);
  }
}

void displayGPSData() {
  // Display Latitude and Longitude
  if (gps.location.isValid()) {
    Serial.print("Latitude: ");
    Serial.print(gps.location.lat(), 6);
    Serial.print(" Longitude: ");
    Serial.println(gps.location.lng(), 6);
  } else {
    Serial.println("Location: Not available");
  }

  // Display Date and Time
  if (gps.date.isValid() && gps.time.isValid()) {
    Serial.print("Date: ");
    Serial.print(gps.date.day());
    Serial.print("/");
    Serial.print(gps.date.month());
    Serial.print("/");
    Serial.println(gps.date.year());

    Serial.print("Time: ");
    Serial.print(gps.time.hour());
    Serial.print(":");
    Serial.print(gps.time.minute());
    Serial.print(":");
    Serial.println(gps.time.second());
  } else {
    Serial.println("Date/Time: Not available");
  }
}
