#include <RH_ASK.h>
#include <SPI.h>

#define RELAY_MOTOR 7
#define RELAY_BULB 8
#define BUZZER_PIN 9
#define LED_PIN 6

RH_ASK driver;

bool voiceMode = false;
bool motorState = false;
bool bulbState = false;
bool buzzerState = false;
bool ledState=false;

void setup() {
    Serial.begin(9600);
    if (!driver.init()) {
        Serial.println("RF Initialization Failed");
        while (1);
    }
    Serial.println("Receiver Ready");

    pinMode(RELAY_MOTOR, OUTPUT);
    pinMode(RELAY_BULB, OUTPUT);
    pinMode(BUZZER_PIN, OUTPUT);
    pinMode(LED_PIN, OUTPUT);
}

void loop() {
    uint8_t buf[RH_ASK_MAX_MESSAGE_LEN];
    uint8_t buflen = sizeof(buf);

    if (driver.recv(buf, &buflen)) {
        buf[buflen] = '\0';
        Serial.print("Received: ");
        Serial.println((char *)buf);

        int modeInt, flex1, flex2, flex3, flex4;
        sscanf((char *)buf, "%d,%d,%d,%d,%d", &modeInt, &flex1, &flex2, &flex3, &flex4);
        voiceMode = (bool)modeInt;

        if (!voiceMode) {  // Home Automation Mode
            handleHomeAutomation(flex1, flex2, flex3, flex4);
        }
    }
}

// **Function to Handle Home Automation**
void handleHomeAutomation(int f1, int f2, int f3, int f4) {
    if (f1 >= 850) {
        motorState = !motorState;
        digitalWrite(RELAY_MOTOR, motorState ? HIGH : LOW);
        Serial.println(motorState ? "Motor ON" : "Motor OFF");
    }

    if (f2 >= 850) {
        bulbState = !bulbState;
        digitalWrite(RELAY_BULB, bulbState ? HIGH : LOW);
        Serial.println(bulbState ? "Bulb ON" : "Bulb OFF");
    }

    if (f3 >= 850) {
        buzzerState = !buzzerState;
        digitalWrite(BUZZER_PIN, buzzerState ? HIGH : LOW);
        Serial.println(buzzerState ? "Buzzer ON" : "Buzzer OFF");
    }

    if (f4 >= 850) {
        ledState = !ledState;
        digitalWrite(LED_PIN, ledState ? HIGH : LOW);
        Serial.println(ledState ? "led ON" : "led OFF");
    }
} 
