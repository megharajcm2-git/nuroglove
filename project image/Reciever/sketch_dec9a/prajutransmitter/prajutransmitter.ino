#include <DFRobotDFPlayerMini.h>
#include "mp3tf16p.h"

MP3Player mp3(10, 11); // Digital signal pin for DFPlayer Mini
int relayPinBulb = 7;        // Relay control pin for the bulb
int relayPinMotor = 8;       // Relay control pin for the DC motor
int buzzerPin = 9;           // Buzzer control pin
int flexSensorPinBulb = A1;  // Flex sensor for the bulb
int flexSensorPinMotor = A2; // Flex sensor for the motor
int flexSensorPinBuzzer = A3;// Flex sensor for the buzzer
int flexSensorPinLed = A4;   // Flex sensor for the LED
int flexThreshold = 800;     // Threshold value for all flex sensors
bool bulbState = false;      // Variable to store the bulb state (ON/OFF)
bool motorState = false;     // Variable to store the motor state (ON/OFF)
bool buzzerState = false;    // Variable to store the buzzer state (ON/OFF)
bool ledState = false;       // Variable to store the LED state (ON/OFF)
bool previousFlexStateBulb = false;  // Variable for flex sensor for bulb
bool previousFlexStateMotor = false; // Variable for flex sensor for motor
bool previousFlexStateBuzzer = false; // Variable for flex sensor for buzzer
bool previousFlexStateLed = false;    // Variable for flex sensor for LED

bool mode = true; // true for Home Automation, false for DFPlayer Mini mode
unsigned long lastModeChangeTime = 0; // Store the time of last mode change
const unsigned long debounceDelay = 1000; // 1-second debounce delay
#include <RH_ASK.h>
#include <SPI.h>

RH_ASK driver;

//data pin to digital pin 12

void setup() {
  
    if (!driver.init()) {
        Serial.println("Initialization failed");
        while (1);
    }
    Serial.begin(9600);
    Serial.println("Transmitter Ready");



  Serial.begin(9600);
  mp3.initialize();

  pinMode(relayPinBulb, OUTPUT);    // Set relay pin for bulb as output
  pinMode(relayPinMotor, OUTPUT);   // Set relay pin for motor as output
  pinMode(buzzerPin, OUTPUT);       // Set buzzer pin as output
  pinMode(6, OUTPUT);              // Set LED pin as output

  digitalWrite(relayPinBulb, LOW);  // Ensure the bulb is off initially
  digitalWrite(relayPinMotor, LOW); // Ensure the motor is off initially
  digitalWrite(buzzerPin, LOW);     // Ensure the buzzer is off initially
  digitalWrite(6, LOW);            // Ensure the LED is off initially
}

void loop() {
  // Read flex sensor values
  int flexValueBulb = analogRead(flexSensorPinBulb);   // Read flex sensor for bulb
  int flexValueMotor = analogRead(flexSensorPinMotor); // Read flex sensor for motor
  int flexValueBuzzer = analogRead(flexSensorPinBuzzer); // Read flex sensor for buzzer
  int flexValueLed = analogRead(flexSensorPinLed); // Read flex sensor for LED

  Serial.print("Flex Sensor Bulb Value: ");
  Serial.println(flexValueBulb);
  Serial.print("Flex Sensor Motor Value: ");
  Serial.println(flexValueMotor);
  Serial.print("Flex Sensor Buzzer Value: ");
  Serial.println(flexValueBuzzer);
  Serial.print("Flex Sensor LED Value: ");
  Serial.println(flexValueLed);

  // Check if all four sensors are bent to toggle mode
  if (flexValueBulb > flexThreshold && flexValueMotor > flexThreshold && flexValueBuzzer > flexThreshold && flexValueLed > flexThreshold) {
    unsigned long currentTime = millis();
    if (currentTime - lastModeChangeTime > debounceDelay) {
      mode = !mode; // Toggle mode
      lastModeChangeTime = currentTime; // Update last mode change time
      Serial.print("Mode switched to: ");
      Serial.println(mode ? "Home Automation Mode" : "DFPlayer Mini Mode");
    }
  }

  // Mode 1: Home Automation
  char msg[10]; 
  if (mode) {
    // Bulb control with flex sensor
    bool currentFlexStateBulb = flexValueBulb > flexThreshold;
    if (currentFlexStateBulb && !previousFlexStateBulb) {
      bulbState = !bulbState; // Toggle bulb state
        if (bulbState) {
            strcpy(msg, "BULB_ON"); // Send bulb ON message
        } else {
            strcpy(msg, "BULB_OFF"); // Send bulb OFF message
        }
        driver.send((uint8_t *)msg, strlen(msg));
        driver.waitPacketSent();
        Serial.print("Message Sent: ");
        Serial.println(msg);
        delay(1000); // Debounce delay for flex sensor 2
    }

    // Motor control with flex sensor
    bool currentFlexStateMotor = flexValueMotor > flexThreshold;
    if (currentFlexStateMotor && !previousFlexStateMotor) {
      motorState = !motorState; // Toggle motor state
        if (motorState) {
            strcpy(msg, "MOTOR_ON"); // Send motor ON message
        } else {
            strcpy(msg, "MOTOR_OFF"); // Send motor OFF message
        }
        driver.send((uint8_t *)msg, strlen(msg));
        driver.waitPacketSent();
        Serial.print("Message Sent: ");
        Serial.println(msg);
        delay(1000); // Debounce delay for flex sensor 1
    }

    // Buzzer control with flex sensor
    bool currentFlexStateBuzzer = flexValueBuzzer > flexThreshold;
    if (currentFlexStateBuzzer && !previousFlexStateBuzzer) {
      buzzerState = !buzzerState; // Toggle buzzer state
        if (buzzerState) {
            strcpy(msg, "BUZZER_ON"); // Send buzzer ON message
        } else {
            strcpy(msg, "BUZZER_OFF"); // Send buzzer OFF message
        }
        driver.send((uint8_t *)msg, strlen(msg));
        driver.waitPacketSent();
        Serial.print("Message Sent: ");
        Serial.println(msg);
        delay(1000); // Debounce delay for flex sensor 3
    }

    // LED control with flex sensor
    bool currentFlexStateLed = flexValueLed > flexThreshold;
    if (currentFlexStateLed && !previousFlexStateLed) {
      ledState = !ledState; // Toggle LED state
        if (ledState) {
            strcpy(msg, "LED_ON"); // Send LED ON message
        } else {
            strcpy(msg, "LED_OFF"); // Send LED OFF message
        }
        driver.send((uint8_t *)msg, strlen(msg));
        driver.waitPacketSent();
        Serial.print("Message Sent: ");
        Serial.println(msg);
        delay(1000); // Debounce delay for flex sensor 4
    }
  } 

  // Mode 2: DFPlayer Mini mode (playing message)
  else {
    if (flexValueBulb > flexThreshold) {
      mp3.playTrackNumber(1, 30); // Play message 1
      delay(500);
    }
    if (flexValueMotor > flexThreshold) {
      mp3.playTrackNumber(2, 30); // Play message 2
      delay(500);
    }
    if (flexValueBuzzer > flexThreshold) {
      mp3.playTrackNumber(3, 30); // Play message 3
      delay(500);
    }
    if (flexValueLed > flexThreshold) {
      mp3.playTrackNumber(4, 30); // Play message 4
      delay(500);
    }
  }

  // Update previous flex states for the next loop
  previousFlexStateBulb = flexValueBulb > flexThreshold;
  previousFlexStateMotor = flexValueMotor > flexThreshold;
  previousFlexStateBuzzer = flexValueBuzzer > flexThreshold;
  previousFlexStateLed = flexValueLed > flexThreshold;

  delay(100);
}
