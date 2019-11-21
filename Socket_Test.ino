#include "ESP8266WiFi.h"
#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h>
#include "base64.h"
#include <WiFiUdp.h>

const char* ssid = "OnePlus 6"; //SSID Username
const char* password =  "hellohicupnoodle"; //SSID Password
String ip = ""; //Store machine ip
String output = ""; //Store data
String data = ""; //String to store data
int flag = 0; //Flag for data

// buffers for receiving and sending data through UDP
char packetBuffer[UDP_TX_PACKET_MAX_SIZE + 1]; //buffer to hold incoming packet,
char  ReplyBuffer[] = "acknowledged\r\n";       // a string to send back
unsigned int localPort = 8082; //local port to listen on for udp message
WiFiUDP Udp; //Init UDP

// Motor variables
int d1 = 5; //GPIO-5 of modemcu (D1)
int d2 = 4; //GPIO-4 of nodemcu (D2)

WiFiServer wifiServer(80); //Arudino Listening on Port 80 for instructions...

void setup() {
  // Connect to AP
  Serial.begin(115200);

  delay(1000);

  WiFi.begin(ssid, password);

  //Init power to pins for motor
  pinMode(d1,OUTPUT);
  pinMode(d2,OUTPUT);

  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting..");
  }

  Serial.print("Connected to WiFi. IP:");
  Serial.println(WiFi.localIP());
  ip = WiFi.localIP().toString(); //Storing IP to send to Server

  wifiServer.begin(); //Init listening socket
  Udp.begin(localPort); //Init listening port for udp replies

  // Sending HTTP POST request to server (UID, Location)
  StaticJsonBuffer<300> JSONbuffer;   //Declaring static JSON buffer
  JsonObject& JSONencoder = JSONbuffer.createObject();

  JSONencoder["machine_id"] = "ICT1003"; //Machine ID
  JSONencoder["location"] = "SIT"; //Location of Machine
  JSONencoder["ip"] = ip; //IP of Machine

  char JSONmessageBuffer[300];
  JSONencoder.prettyPrintTo(JSONmessageBuffer, sizeof(JSONmessageBuffer));
  Serial.println(JSONmessageBuffer);

  HTTPClient http;    //Declare object of class HTTPClient
  http.begin("http://192.168.43.224:8800/api/machine/startup/");  //Specify destination for HTTP request
  http.header("POST / HTTP/1.1"); // POST
  http.header("Accept: */*");
  http.header("Host: http://192.168.43.224:8800/api/machine/startup/"); //HOST
  http.addHeader("Authorization", "Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6IldlZWUiLCJleHBpcmVzIjoxNTc2MTE5NTM1NDMwLCJuZXZlckV4cGlyZSI6dHJ1ZX0.eA4YoCnmi8bw8-Fbn997FUXGDz6XXkCtQQSYfVrTNzw"); // Authentication for Server
  http.addHeader("Content-Type", "application/json");  //Specify content-type header
  String contentLengthStr = String(JSONmessageBuffer); //Convert Char to String
  int contentLength = contentLengthStr.length(); //Find Content-Length
  http.addHeader("Content-Length", String(contentLength)); //Content-Length
  int httpCode = http.POST(JSONmessageBuffer);   //Send the request

  String payload = http.getString(); //Retrieve reply from Server
  Serial.println(httpCode);   //Print HTTP return code
  Serial.println(payload);    //Print request response payload
  Serial.println("Setup completed..");
}

//Motor
void power_motor(String selection) {
    if(selection == "1"){
        digitalWrite(d1, HIGH);
        delay(500);
        digitalWrite(d1, LOW);
    }

    if(selection == "2"){
       digitalWrite(d2, HIGH);
       delay(500);
       digitalWrite(d2, LOW);
    }
}

// UDP send LOOP
void loop() {
  // if there's data available, read a packet
  int packetSize = Udp.parsePacket();
  if (packetSize) {
    Serial.printf("Received packet of size %d from %s:%d\n    (to %s:%d, free heap = %d B)\n",
                  packetSize,
                  Udp.remoteIP().toString().c_str(), Udp.remotePort(),
                  Udp.destinationIP().toString().c_str(), Udp.localPort(),
                  ESP.getFreeHeap());

    // read the packet into packetBufffer
    int n = Udp.read(packetBuffer, UDP_TX_PACKET_MAX_SIZE);
    packetBuffer[n] = 0;
    Serial.println("Contents:");
    Serial.println(packetBuffer);

    // Running Motor
    power_motor(packetBuffer);
    Serial.println("Running motor...");


    // send a reply, to the IP address and port that sent us the packet we received
//    Udp.beginPacket(Udp.remoteIP(), Udp.remotePort());
//    Udp.write(ReplyBuffer);
//    Udp.endPacket();
  }

}
