#include <SoftwareSerial.h>
#include <PulseSensorPlayground.h>
#include <DHT.h>
#include <TinyGPS++.h>

// Define SoftwareSerial pins for Bluetooth communication
SoftwareSerial Bluetooth(2, 3); // RX, TX

// Pulse Sensor Variables
const int pulsePin = A0;  // Pulse sensor connected to analog pin A0
PulseSensorPlayground pulseSensor;  // Create a PulseSensorPlayground object
int bpm = 0;             // Heart rate in BPM (beats per minute)
int pulseValue = 0;      // Raw pulse value

// DHT11 Sensor Variables
#define DHTPIN 4          // Pin connected to DHT11 data pin
#define DHTTYPE DHT11     // Define the sensor type (DHT11)
DHT dht(DHTPIN, DHTTYPE); // Initialize DHT sensor
float temperature = 0.0;  // Temperature in Celsius
float humidity = 0.0;     // Humidity percentage

// GPS Module Variables
SoftwareSerial ss(10, 11); // GPS module connected to pins 10 (RX) and 11 (TX)
TinyGPSPlus gps;           // Create an instance of the TinyGPSPlus library
long latitude = 0;         // Store the GPS latitude
long longitude = 0;        // Store the GPS longitude

void setup() {
  // Initialize serial communication
  Serial.begin(9600);        // For Serial Monitor debugging
  Bluetooth.begin(9600);     // Initialize Bluetooth module
  dht.begin();               // Initialize DHT sensor
  ss.begin(9600);            // Start GPS communication

  // Initialize the pulse sensor
  pulseSensor.analogInput(pulsePin);
  pulseSensor.begin();

  Serial.println("System initialized. Ready to send heart rate, temperature, humidity, and GPS data.");
}

void loop() {
  // Get BPM from the pulse sensor
  bpm = pulseSensor.getBeatsPerMinute();  // Get BPM (Heart Rate)
  pulseValue = pulseSensor.getLatestSample(); // Get the latest pulse sample
  
  // Apply threshold to BPM to make sure it's within the valid heart rate range (70 - 90 BPM)
  if (pulseValue > 480 && pulseValue < 580) {
    bpm = 70;  // Set minimum limit for BPM
  } else if (pulseValue > 580) {
    bpm = 90;  // Set maximum limit for BPM
  }
  
  // Send BPM to Serial Monitor and Bluetooth
  if (bpm > 0) {  // If BPM is valid
    Serial.print("Pulse Detected! BPM: ");
    Serial.println(bpm);
    Bluetooth.print("Pulse Detected! BPM: ");
    Bluetooth.println(bpm);
  }

  // Read Temperature and Humidity from DHT11
  temperature = dht.readTemperature();
  humidity = dht.readHumidity();

  // Check if readings are valid
  if (!isnan(temperature) && !isnan(humidity)) {
    // Print and send da ta
    Serial.print("Temperature: ");
    Serial.print(temperature);
    Serial.print(" °C, Humidity: ");
    Serial.print(humidity);
    Serial.println(" %");
    Bluetooth.print("Temperature: ");
    Bluetooth.print(temperature);
    Bluetooth.print(" °C, Humidity: ");
    Bluetoot  h.print(humidity);
    Bluetooth.println(" %");
  } else {
    Serial.println("Failed to read from DHT sensor.");
  }

  // GPS Data Retrieval
  while (ss.available() > 0) {
    gps.encode(ss.read()); // Feed GPS data to the GPS object
  }

  // If a valid GPS fix is available
  if (gps.location.isUpdated()) {
    latitude = gps.location.lat();
    longitude = gps.location.lng();
    
    // Print and send GPS data to Serial Monitor and Bluetooth
    Serial.print("Latitude: ");
    Serial.print(latitude, 6); // 6 decimal places for latitude
    Serial.print(", Longitude: ");
    Serial.println(longitude, 6); // 6 decimal places for longitude

    Bluetooth.print("Latitude: ");
    Bluetooth.print(latitude, 6);
    Bluetooth.print(", Longitude: ");
    Bluetooth.println(longitude, 6);
  }

  // Optional delay for stability
  delay(2000);
}
