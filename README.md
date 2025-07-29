# 🧠 NEUROGLOVE – AI-Powered Smart Glove for Patient Care

NEUROGLOVE is an intelligent, multi-functional wearable glove designed to assist patients and individuals with disabilities by integrating **gesture control**, **health monitoring**, **location tracking**, and **smart automation**.

> Built using Arduino Mega and inspired by the real-life needs of elderly and differently-abled individuals, NEUROGLOVE brings innovation and care to the fingertips.

---

## 🔍 Project Overview

NEUROGLOVE uses a combination of **AI algorithms**, **sensors**, **wireless communication**, and **gesture recognition** to:
- Monitor health parameters (pulse, temperature)
- Send emergency alerts
- Control smart devices like lights, fans, and alarms
- Track location using GPS
- Enable gesture-based communication for those with speech/motor impairments

---

## 🚀 Features

- ✋ **Gesture Recognition** – Detects hand movements to control external devices or trigger functions
- ❤️ **Health Monitoring** – Continuously tracks pulse rate and temperature
- 🧭 **GPS Location Tracking** – Sends real-time coordinates during emergencies
- 📡 **Wireless Communication** – Uses RF and Wi-Fi modules for remote alert systems
- 🏠 **Home Automation** – Control fan, light, and alarm using glove gestures
- 🚨 **Emergency Mode** – Alerts family or caregivers via RF when abnormal vitals are detected

---

## 🧰 Hardware Used

| Component              | Purpose                           |
|------------------------|------------------------------------|
| Arduino Mega           | Main controller                    |
| Pulse Sensor           | Heart rate monitoring              |
| Temperature Sensor     | Body temperature monitoring        |
| GPS Module             | Location tracking                  |
| HC-12 / RF Module      | Wireless emergency alerts          |
| Wi-Fi Module (ESP8266) | Internet-based messaging           |
| Relay Module           | Control of light, fan, alarm       |
| Flex Sensors (4)       | Gesture recognition                |
| Buzzer / Speaker       | Sound alert system                 |
| LEDs                   | Status indication                  |
| Battery                | Power source                       |
| Glove                  | Wearable interface                 |

---

## 🔧 How It Works

1. **User wears the glove** equipped with flex sensors and health sensors.
2. **Health data** is continuously monitored.
3. **Specific gestures** are recognized to perform actions:
   - Turn on/off lights
   - Send emergency alerts
   - Trigger buzzer or speaker
4. If **abnormal pulse or temperature** is detected:
   - GPS data is fetched
   - RF module sends location & alert to caregiver

---

## 🛠️ Setup Instructions

1. Connect all sensors and modules to Arduino Mega based on the circuit diagram.
2. Upload the Arduino code via Arduino IDE.
3. Power the glove using a battery pack.
4. Test gesture responses and ensure health sensor readings display correctly.
5. Set threshold values in code for pulse and temperature.

---![PROJECT PHOTO](https://github.com/user-attachments/assets/30beaa6f-0c84-4062-bbb8-48c391681b60)


<img width="1322" height="720" alt="Screenshot 2025-03-30 151156" src="https://github.com/user-attachments/assets/b5fcc348-cf05-4b7d-b79f-0ad625d1b4d1" />
<img width="1292" height="597" alt="Screenshot 2025-03-30 151215" src="https://github.com/user-attachments/assets/25871818-8cd6-4656-99e0-82c35aa310d3" />


## 📁 Folder Structure

```bash
NEUROGLOVE/
├── Arduino_Code/
│   ├── neuroglove_main.ino
│   ├── gesture_control.ino
│   └── health_monitoring.ino
├── images/
│   └── glove_diagram.jpg
├── circuit_diagrams/
│   └── neuroglove_circuit.fritzing
├── README.md
└── LICENSE
