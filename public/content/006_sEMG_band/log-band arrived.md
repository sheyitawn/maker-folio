---
date: 2025-08-12T17:09:00
imgs:
  - cover.png
tags:
  - hardware
  - live
---
Just got the band and I'm testing with a test sketch i got from chatgpt to get it running during work.
```c#
/*

  EMG Single-Channel Reader + Clench Counter

  Board: Arduino UNO/Nano (ATmega328P)

  Signal in: A0

  

  What it does:

  - Calibrates DC offset for 2 s

  - High-pass (subtract mean), full-wave rectify

  - Smooth with moving average to get envelope

  - Prints raw & envelope for Serial Plotter

  - Counts clenches using threshold + hysteresis

*/

  

const int EMG_PIN = A0;

  

// ---- Sampling ----

const unsigned long SAMPLE_PERIOD_US = 1000; // 1 kHz target

unsigned long lastSampleUs = 0;

  

// ---- Calibration ----

const unsigned long CALIBRATION_MS = 2000;

bool calibrated = false;

float dcMean = 0.0;

unsigned long calibStartMs;

  

// ---- Envelope (moving average) ----

const int MA_WINDOW = 25;  // 25 samples @1kHz ≈ 25 ms

float maBuffer[MA_WINDOW];

int maIndex = 0;

int maCount = 0;

float maSum = 0.0;

  

// ---- Clench detection ----

float threshHigh = 25.0; // tune after first plots

float threshLow  = 15.0; // hysteresis lower bound

bool inClench = false;

unsigned long clenchCount = 0;

  

// ---- Utilities ----

inline float fastAbs(float x) { return x < 0 ? -x : x; }

  

void resetMA() {

  maSum = 0;

  maIndex = 0;

  maCount = 0;

  for (int i = 0; i < MA_WINDOW; i++) maBuffer[i] = 0;

}

  

void setup() {

  pinMode(EMG_PIN, INPUT);

  analogReference(DEFAULT); // UNO uses 5V AREF by default

  

  Serial.begin(115200);

  while (!Serial) { ; }

  

  // Warm-up message

  Serial.println(F("EMG starting... Keep muscle relaxed for 2 seconds."));

  calibStartMs = millis();

  dcMean = 0.0;

  resetMA();

}

  

void loop() {

  const unsigned long nowUs = micros();

  if (nowUs - lastSampleUs < SAMPLE_PERIOD_US) return;

  lastSampleUs = nowUs;

  

  // 1) Sample

  int raw = analogRead(EMG_PIN); // 0..1023 on UNO

  

  // 2) Calibration (estimate DC mean while relaxed)

  if (!calibrated) {

    unsigned long elapsed = millis() - calibStartMs;

    // incremental mean to avoid big buffers

    static unsigned long n = 0;

    n++;

    dcMean += (raw - dcMean) / (float)n;

  

    if (elapsed >= CALIBRATION_MS) {

      calibrated = true;

      resetMA();

      Serial.print(F("Calibration done. dcMean="));

      Serial.println(dcMean, 2);

      Serial.println(F("Open Serial Plotter (Ctrl+Shift+L)."));

      Serial.println(F("Columns: raw, env, threshHigh, threshLow"));

    }

    return;

  }

  

  // 3) High-pass (remove DC mean), rectify

  float centered = raw - dcMean;

  float rectified = fastAbs(centered);

  

  // 4) Moving-average envelope

  maSum -= maBuffer[maIndex];

  maBuffer[maIndex] = rectified;

  maSum += rectified;

  maIndex++;

  if (maIndex >= MA_WINDOW) maIndex = 0;

  if (maCount < MA_WINDOW) maCount++;

  float envelope = maSum / (float)maCount;

  

  // 5) Clench detection with hysteresis

  if (!inClench && envelope > threshHigh) {

    inClench = true;

    clenchCount++;

  } else if (inClench && envelope < threshLow) {

    inClench = false;

  }

  

  // 6) Print for Serial Plotter and debug

  // Format: raw, envelope, threshHigh, threshLow, clenchCount

  Serial.print(raw); Serial.print(',');

  Serial.print(envelope); Serial.print(',');

  Serial.print(threshHigh); Serial.print(',');

  Serial.print(threshLow); Serial.print(',');

  Serial.println(clenchCount);

}
```

I'm able to get values from different hand movements. Going to try honing down on specific finger movements, thane I'll think about reading what this looks like in different positions on the arm, and then finally recreating the sensor. doesn't look too complicated


testing on here: the **flexor digitorum superficialis**
![[Pasted image 20250812171256.png]]


okay i found official documentaiton for a similar product, gonna try that