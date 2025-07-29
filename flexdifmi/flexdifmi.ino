#include <DFRobotDFPlayerMini.h>
#include "mp3tf16p.h"

MP3Player mp3(11, 10);// digital signal pin for dfmini player
const int flexPin = A0;//fast fourier transform

void setup() {
  Serial.begin(9600);
  mp3.initialize();
}

void loop() {
  while (true) {
    int flexValue = analogRead(flexPin);// after conversion to anlog

    Serial.print("Flex Sensor Value: ");
    Serial.println(flexValue);

    // Check if flex sensor value is greater than 800
    if (flexValue > 800) {
      // If true, play DFMini track 1
      mp3.playTrackNumber(1, 30);
      delay(500); // Add a delay to avoid continuous triggering
    }

    delay(20); // Allow time for the serial monitor to update
}
}