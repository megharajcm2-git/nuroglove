#include <RH_ASK.h>
#include <SPI.h>
#include <DFRobotDFPlayerMini.h>
#include "mp3tf16p.h"

#define FLEX_PIN1 A1
#define FLEX_PIN2 A2
#define FLEX_PIN3 A3
#define FLEX_PIN4 A4

MP3Player mp3(10, 11);
RH_ASK driver;

bool voiceMode = false;  // false = Home Automation, true = Voice Mode

void setup() {
    Serial.begin(9600);
    if (!driver.init()) {
        Serial.println("RF Initialization Failed");
        while (1);
    }
    Serial.println("Transmitter Ready");
    mp3.initialize();
}

void loop() {
    int flex1 = analogRead(FLEX_PIN1);
    int flex2 = analogRead(FLEX_PIN2);
    int flex3 = analogRead(FLEX_PIN3);
    int flex4 = analogRead(FLEX_PIN4);

    Serial.print("Flex 1: "); Serial.println(flex1);
    Serial.print("Flex 2: "); Serial.println(flex2);
    Serial.print("Flex 3: "); Serial.println(flex3);
    Serial.print("Flex 4: "); Serial.println(flex4);

    // **Mode Shift Conditions**
    if (flex3 > 850 && flex4 > 850) {
        voiceMode = true;  // Switch to Voice Mode
        Serial.println("Switched to Voice Mode");
        delay(2000);
    } else if (flex1 > 850 && flex2 > 850) {
        voiceMode = false;  // Switch to Home Automation Mode
        Serial.println("Switched to Home Automation Mode");
        delay(2000);
    }

    // **Function Calls Based on Mode**
    if (voiceMode) {
        playVoiceFeedback(flex1, flex2, flex3, flex4);
    } else {
        sendHomeAutomationData(flex1, flex2, flex3, flex4);
    }

    delay(500);
}

// **Function to Send Home Automation Data**
void sendHomeAutomationData(int f1, int f2, int f3, int f4) {
    char msg[32];
    sprintf(msg, "%d,%d,%d,%d,%d", voiceMode, f1, f2, f3, f4);
    driver.send((uint8_t *)msg, strlen(msg));
    driver.waitPacketSent();
    Serial.println("Sent Home Automation Data");
}

// **Function to Play Voice Feedback**
void playVoiceFeedback(int f1, int f2, int f3, int f4) {
    if (f1 > 850) mp3.playTrackNumber(1, 30);
    if (f2 > 850) mp3.playTrackNumber(2, 30);
    if (f3 > 850) mp3.playTrackNumber(3, 30);
    if (f4 > 850) mp3.playTrackNumber(4, 30);
    Serial.println("Playing Voice Feedback");
}
