#define  RED            0x03
#define WHITE           0xFF
#include <SPI.h>
#include <STBLE.h>
#include <TinyScreen.h>
#include <SPI.h>
#include <Wire.h>
#include "qrcode.h"


// Initilization of Tiny Screen
TinyScreen display = TinyScreen(0);

// Constant values to centre QR Code
uint8_t x_offset = 19;
uint8_t y_offset = 3;
char* code = "none";

//Debug output adds extra flash and memory requirements!
#ifndef BLE_DEBUG
#define BLE_DEBUG false
#endif

#if defined (ARDUINO_ARCH_AVR)
#define SerialMonitorInterface Serial
#elif defined(ARDUINO_ARCH_SAMD)
#define SerialMonitorInterface SerialUSB
#endif


uint8_t ble_rx_buffer[21];
uint8_t ble_rx_buffer_len = 0;
uint8_t ble_connection_state = false;
char* cmd = "uuid:";
#define PIPE_UART_OVER_BTLE_UART_TX_TX 0


void setup() {
  SerialMonitorInterface.begin(9600);
  Wire.begin();
  display.begin();
  display.setFlip(true);
  // Set screen brightness to max (15)
  display.setBrightness(15);
  // Draws a white rectangle to be used as background
  display.drawRect(x_offset - 3, 0, 58 + 6, 64, TSRectangleFilled, TS_16b_White);
  display.setFont(liberationSans_14ptFontInfo);
  display.setCursor(18, 23);
  display.fontColor(RED, WHITE);
  display.print("Set QR");
  while (!SerialMonitorInterface); //This line will block until a serial monitor is opened with TinyScreen+!
  BLEsetup();
}

void loop() {
  aci_loop();//Process any ACI commands or events from the NRF8001- main BLE handler, must run often. Keep main loop short.
  if (ble_rx_buffer_len) {//Check if data is available
    if (strstr((char*)ble_rx_buffer, cmd) != NULL) {
      code = (char*)ble_rx_buffer + 5;
      SerialMonitorInterface.println(code);
      lib_aci_send_data(0,"Setting QR Code",15);
      genQRCode();
      lib_aci_send_data(0,"Done",4);
    }
    ble_rx_buffer_len = 0;//clear afer reading
  }
  if (SerialMonitorInterface.available()) {//Check if serial input is available to send
    delay(10);//should catch input
    uint8_t sendBuffer[21];
    uint8_t sendLength = 0;
    while (SerialMonitorInterface.available() && sendLength < 19) {
      sendBuffer[sendLength] = SerialMonitorInterface.read();
      Serial.print(sendBuffer[sendLength]);
      SerialMonitorInterface.write('Hello');
      sendLength++;
    }
    if (SerialMonitorInterface.available()) {
      SerialMonitorInterface.print(F("Input truncated, dropped: "));
      if (SerialMonitorInterface.available()) {
        SerialMonitorInterface.write(SerialMonitorInterface.read());
      }
    }
    sendBuffer[sendLength] = '\0'; //Terminate string
    sendLength++;
    if (!lib_aci_send_data(PIPE_UART_OVER_BTLE_UART_TX_TX, (uint8_t*)sendBuffer, sendLength))
    {
      SerialMonitorInterface.println(F("TX dropped!"));
    }
  }
}

void genQRCode() {
  // Initializing QR Code
  QRCode qrcode;
  uint8_t qrcodeBytes[qrcode_getBufferSize(3)];
  uint8_t color;
  // Sets QRCode Content
  qrcode_initText(&qrcode, qrcodeBytes, 3, ECC_LOW, code);
  // Start of display
  display.startData();
  lib_aci_send_data(0,"Displaying QR Code",18);
  for (uint8_t y = 0; y < qrcode.size; y++) {
    for (uint8_t x = 0; x < qrcode.size; x++) {
      // Getting color of QR Code at Location X Y
      color = qrcode_getModule(&qrcode, x , y) ? TS_16b_Black : TS_16b_White;
      if (color != TS_16b_White) {
        // Scales 1 pixel to 4
        display.drawPixel(x_offset + x * 2, y_offset + y * 2, color);
        display.drawPixel(x_offset + x * 2 + 1, y_offset + y * 2, color);
        display.drawPixel(x_offset + x * 2, y_offset + y * 2 + 1, color);
        display.drawPixel(x_offset + x * 2 + 1, y_offset + y * 2 + 1, color);
      }
    }
  }
  // End of Display
  display.endTransfer();

}
