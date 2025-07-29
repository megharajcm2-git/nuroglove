#include <DFRobotDFPlayerMini.h>
#include "mp3tf16p.h"

// Water Level Sensor
const int waterLevelPin = A0; // Define the analog pin
int waterLevelValue = 0;      // Variable to store the sensor value

// Define the maximum possible water level in your container
const float maxWaterLevel = 20.0; // Example: 20 cm
const int maxAnalogValue = 1023;  // Maximum analog value (10-bit ADC)

// Ultrasonic Sensor (HC-SR04)
const int trigPin = 9; // Trig pin of HC-SR04 connected to Arduino D2
const int echoPin = 8; // Echo pin of HC-SR04 connected to Arduino D3
long duration;
int distance;

// MP3 Player
MP3Player mp3(10, 11); //MP3Player mp3(TX, RX);

void setup() {
  Serial.begin(9600);
  
  // Initialize water level sensor
  pinMode(waterLevelPin, INPUT);
  
  // Initialize ultrasonic sensor
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  
  // Initialize MP3 player
  mp3.initialize();
}

void loop() {
  // Read water level sensor
  waterLevelValue = analogRead(waterLevelPin);
  float waterLevelCm = (waterLevelValue * maxWaterLevel) / maxAnalogValue;
  
  // Read ultrasonic sensor
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  duration = pulseIn(echoPin, HIGH);
  distance = duration * 0.034 / 2;
  
  // Print sensor values for debugging
  Serial.print("Water Level: ");
  Serial.print(waterLevelCm);
  Serial.println(" cm");
  Serial.print("Distance: ");
  Serial.print(distance);
  Serial.println(" cm");

  // Check conditions and trigger MP3 playback
  if (distance < 30) {
    // Play track if distance is less than 30 cm
    mp3.playTrackNumber(1, 30); // Adjust track number and volume as needed
    delay(1000); // Delay to avoid rapid triggering
  }
  
  if (waterLevelCm >10) {
    // Play second track if water level is exactly 10 cm
    mp3.playTrackNumber(2, 30); // Adjust track number and volume as needed
    delay(1000); // Delay to avoid rapid triggering
  }

  // Delay before next iteration
  delay(500); // Adjust delay as needed for sensor stability and responsiveness
}
