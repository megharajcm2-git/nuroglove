
#include <RH_ASK.h>
#include <SPI.h>

RH_ASK driver;

#define MOTOR_RELAY_PIN 8  // Define pin 8 for the relay controlling the motor
#define BULB_RELAY_PIN 7   // Define pin 7 for the relay controlling the bulb
#define BUZZER_PIN 9       // Define pin 9 for the buzzer control
#define LED_PIN 6          // Define pin 6 for LED control

void setup() {
    Serial.begin(9600);
    if (!driver.init()) {
        Serial.println("Initialization failed");
        while (1);
    }
    
    // Set all devices to LOW initially to ensure they are OFF at the start
    pinMode(MOTOR_RELAY_PIN, OUTPUT); // Set pin 8 as OUTPUT for the motor
    pinMode(BULB_RELAY_PIN, OUTPUT);  // Set pin 7 as OUTPUT for the bulb
    pinMode(BUZZER_PIN, OUTPUT);      // Set pin 9 as OUTPUT for the buzzer
    pinMode(LED_PIN, OUTPUT);         // Set pin 6 as OUTPUT for the LED

    digitalWrite(MOTOR_RELAY_PIN, HIGH); // Ensure motor is OFF initially
    digitalWrite(BULB_RELAY_PIN, HIGH);  // Ensure bulb is OFF initially
    digitalWrite(BUZZER_PIN, LOW);      // Ensure buzzer is OFF initially
    digitalWrite(LED_PIN, LOW);         // Ensure LED is OFF initially

    Serial.println("Receiver Ready");
}

void loop() {
    uint8_t buf[RH_ASK_MAX_MESSAGE_LEN];
    uint8_t buflen = sizeof(buf);

    // Check if a message is received
    if (driver.recv(buf, &buflen)) {
        buf[buflen] = '\0'; // Null-terminate the message
        String message = String((char *)buf);

        // Print the received message
        Serial.print("Message Received: ");
        Serial.println(message);

        // Control the DC motor based on received message
        if (message == "MOTOR_ON") {
            digitalWrite(MOTOR_RELAY_PIN, HIGH); // Turn the motor ON
            Serial.println("Motor Turned ON");
        } else if (message == "MOTOR_OFF") {
            digitalWrite(MOTOR_RELAY_PIN, LOW); // Turn the motor OFF
            Serial.println("Motor Turned OFF");
        }

        // Control the bulb based on received message
        if (message == "BULB_ON") {
            digitalWrite(BULB_RELAY_PIN, HIGH); // Turn the bulb ON
            Serial.println("Bulb Turned ON");
        } else if (message == "BULB_OFF") {
            digitalWrite(BULB_RELAY_PIN, LOW); // Turn the bulb OFF
            Serial.println("Bulb Turned OFF");
        }

        // Control the buzzer based on received message
        if (message == "BUZZER_ON") {
            digitalWrite(BUZZER_PIN, HIGH); // Turn the buzzer ON
            Serial.println("Buzzer Turned ON");
        } else if (message == "BUZZER_OFF") {
            digitalWrite(BUZZER_PIN, LOW); // Turn the buzzer OFF
            Serial.println("Buzzer Turned OFF");
        }

        // Control the LED based on received message
        if (message == "LED_ON") {
            digitalWrite(LED_PIN, HIGH); // Turn the LED ON
            Serial.println("LED Turned ON");
        } else if (message == "LED_OFF") {
            digitalWrite(LED_PIN, LOW); // Turn the LED OFF
            Serial.println("LED Turned OFF");
        }
    }
}

