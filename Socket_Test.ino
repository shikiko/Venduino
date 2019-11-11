#include "ESP8266WiFi.h"
#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h>

const char* ssid = "";
const char* password =  "";
String ip = "";
String output = "";
String data = "";
int flag = 0;


WiFiServer wifiServer(8000);
 
void setup() {
  // Connect to AP
  Serial.begin(115200);
 
  delay(1000);
 
  WiFi.begin(ssid, password);
 
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting..");
  }
 
  Serial.print("Connected to WiFi. IP:");
  Serial.println(WiFi.localIP());
  ip = WiFi.localIP().toString();
 
  wifiServer.begin(); // Init listening socket

  // Sending HTTP POST request to server (UID, Location)
  StaticJsonBuffer<300> JSONbuffer;   //Declaring static JSON buffer
  JsonObject& JSONencoder = JSONbuffer.createObject(); 

  JSONencoder["machine"] = "UID";
  JSONencoder["location"] = "CSA";
  JSONencoder["ip"] = ip;
 
  char JSONmessageBuffer[300];
  JSONencoder.prettyPrintTo(JSONmessageBuffer, sizeof(JSONmessageBuffer));
  Serial.println(JSONmessageBuffer);
  
  HTTPClient http;    //Declare object of class HTTPClient
  http.begin("localhost:8000/api/vending/startup");  //Specify destination for HTTP request
  http.addHeader("Content-Type", "application/json");  //Specify content-type header
  int httpCode = http.POST(JSONmessageBuffer);   //Send the request
  Serial.println("Setup completed..");
}
 
void loop() {
 
  WiFiClient client = wifiServer.available();
//  Serial.println("Listening for new response...");
 
  if (client) {
 
    while (client.connected()) {
 
      while (client.available()>0) {
        char c = client.read();
        output = String(c);
        if (flag == 1) {
          data = data + output;
          //Serial.println(output);
        }
        //Serial.println(output);
        if (output == "=") {
          flag = 1;
        }
      }
 
      delay(10);
    }

    Serial.println(data);
    flag = 0;
    data = "";
    client.stop();
    Serial.println("Client disconnected");
 
  }
}
