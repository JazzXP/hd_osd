// The conversion functions in here are taken from the Blackbox Flight Log Explorer and modified to more modern Javascript
// This is the reason why this project is released under GPLv3

const formatTime = (msec: number, displayMsec: boolean) => {
  let ms, secs, mins, hours;
  ms = Math.round(Math.abs(msec));

  secs = Math.floor(ms / 1000);
  ms %= 1000;

  mins = Math.floor(secs / 60);
  secs %= 60;

  hours = Math.floor(mins / 60);
  mins %= 60;

  return (
    (msec < 0 ? "-" : "") +
    (hours ? `${hours}`.padStart(2, "0") + ":" : "") +
    `${mins}`.padStart(2, "0") +
    ":" +
    `${secs}`.padStart(2, "0") +
    (displayMsec ? "." + `${ms}`.padStart(3, "0") : "")
  );
};

const rcMotorRawToPct = (value: number) => {
  // Motor displayed as percentage
  // TODO: motorOutput[0] should be minThrottle from the header info and motorOutput[1] should be maxThrottle
  const minMotor = 1070;
  const maxMotor = 2000;
  return Math.min(
    Math.max(((value - minMotor) / (maxMotor - minMotor)) * 100.0, 0.0),
    100.0
  );
};

const FLIGHT_LOG_FLIGHT_MODE_NAME_PRE_3_3 = [
  "ARM",
  "ANGLE",
  "HORIZON",
  "BARO",
  "ANTIGRAVITY",
  "MAG",
  "HEADFREE",
  "HEADADJ",
  "CAMSTAB",
  "CAMTRIG",
  "GPSHOME",
  "GPSHOLD",
  "PASSTHRU",
  "BEEPER",
  "LEDMAX",
  "LEDLOW",
  "LLIGHTS",
  "CALIB",
  "GOV",
  "OSD",
  "TELEMETRY",
  "GTUNE",
  "SONAR",
  "SERVO1",
  "SERVO2",
  "SERVO3",
  "BLACKBOX",
  "FAILSAFE",
  "AIRMODE",
  "3DDISABLE",
  "FPVANGLEMIX",
  "BLACKBOXERASE",
  "CAMERA1",
  "CAMERA2",
  "CAMERA3",
  "FLIPOVERAFTERCRASH",
  "PREARM",
];

const FLIGHT_LOG_FLIGHT_MODE_NAME_POST_3_3 = [
  "ARM",
  "ANGLE",
  "HORIZON",
  "MAG",
  "BARO",
  "GPSHOME",
  "GPSHOLD",
  "HEADFREE",
  "PASSTHRU",
  "RANGEFINDER",
  "FAILSAFE",
  "GPSRESCUE",
  "ANTIGRAVITY",
  "HEADADJ",
  "CAMSTAB",
  "CAMTRIG",
  "BEEPER",
  "LEDMAX",
  "LEDLOW",
  "LLIGHTS",
  "CALIB",
  "GOV",
  "OSD",
  "TELEMETRY",
  "GTUNE",
  "SERVO1",
  "SERVO2",
  "SERVO3",
  "BLACKBOX",
  "AIRMODE",
  "3D",
  "FPVANGLEMIX",
  "BLACKBOXERASE",
  "CAMERA1",
  "CAMERA2",
  "CAMERA3",
  "FLIPOVERAFTERCRASH",
  "PREARM",
  "BEEPGPSCOUNT",
  "VTXPITMODE",
  "USER1",
  "USER2",
  "USER3",
  "USER4",
  "PIDAUDIO",
  "ACROTRAINER",
  "VTXCONTROLDISABLE",
  "LAUNCHCONTROL",
];

const FLIGHT_LOG_FLIGHT_STATE_NAME = [
  "GPS_FIX_HOME",
  "GPS_FIX",
  "CALIBRATE_MAG",
  "SMALL_ANGLE",
  "FIXED_WING",
];

const FLIGHT_LOG_FAILSAFE_PHASE_NAME = [
  "IDLE",
  "RX_LOSS_DETECTED",
  "LANDING",
  "LANDED",
];

const FLIGHT_LOG_FEATURES = [
  "RX_PPM",
  "VBAT",
  "INFLIGHT_ACC_CAL",
  "RX_SERIAL",
  "MOTOR_STOP",
  "SERVO_TILT",
  "SOFTSERIAL",
  "GPS",
  "FAILSAFE",
  "SONAR",
  "TELEMETRY",
  "CURRENT_METER",
  "3D",
  "RX_PARALLEL_PWM",
  "RX_MSP",
  "RSSI_ADC",
  "LED_STRIP",
  "DISPLAY",
  "ONESHOT125",
  "BLACKBOX",
  "CHANNEL_FORWARDING",
  "TRANSPONDER",
  "AIRMODE",
  "SUPEREXPO_RATES",
];

const presentFlags = (flags: number, flagNames: string[]) => {
  var printedFlag = false,
    i,
    result = "";

  i = 0;

  while (flags > 0) {
    if ((flags & 1) != 0) {
      if (printedFlag) {
        result += "|";
      } else {
        printedFlag = true;
      }

      result += flagNames[i];
    }

    flags >>= 1;
    i++;
  }

  if (printedFlag) {
    return result;
  } else {
    return "0"; //No flags set
  }
};

export const getConversionFunction = (type: string) => {
  switch (type) {
    case "loopIteration":
      return (value: number) => `${value}`;
    case "time":
      return (value: number) => formatTime(value / 1000, true);
    case "axisP[0]":
    case "axisP[1]":
    case "axisP[2]":
    case "axisI[0]":
    case "axisI[1]":
    case "axisI[2]":
    case "axisD[0]":
    case "axisD[1]":
    case "axisF[0]":
    case "axisF[1]":
    case "axisF[2]":
      return (value: number) => `${value / 10}%`;
    case "rcCommand[0]":
    case "rcCommand[1]":
    case "rcCommand[2]":
    case "rcCommand[3]":
      return (value: number) => `${1500 + value}µs`;
    case "setpoint[0]":
    case "setpoint[1]":
    case "setpoint[2]":
    case "setpoint[3]":
      return (value: number) => `${value}`;
    case "vbatLatest":
      return (value: number) => `${value / 100}V`;
    case "amperageLatest":
      return (value: number) => `${value / 100}A`;
    case "BaroAlt":
      return (value: number) => `${value / 100}M`;
    case "rssi":
      return (value: number) => `${((value / 1024) * 100).toFixed(2)}%`;
    case "gyroADC[0]":
    case "gyroADC[1]":
    case "gyroADC[2]":
      return (value: number) => `${value}°/s`;
    case "accSmooth[0]":
    case "accSmooth[1]":
    case "accSmooth[2]":
      return (value: number) => `${value}g`;
    case "motor[0]":
    case "motor[1]":
    case "motor[2]":
    case "motor[3]":
      return (value: number) => `${rcMotorRawToPct(value)}%`;
    case "flightModeFlags":
      return (value: number) =>
        `${presentFlags(value, FLIGHT_LOG_FLIGHT_MODE_NAME_POST_3_3)}`; //TODO: Pick based on Betaflight version
    case "stateFlags":
      return (value: number) =>
        `${presentFlags(value, FLIGHT_LOG_FLIGHT_STATE_NAME)}`;
    case "failsafePhase":
      return (value: number) =>
        `${presentFlags(value, FLIGHT_LOG_FAILSAFE_PHASE_NAME)}`;
    case "rxSignalReceived":
    case "rxFlightChannelsValid":
      return (value: number) => `${value}`;
    case "heading[0]":
    case "heading[1]":
    case "heading[2]":
      return (value: number) => `${((value / Math.PI) * 180).toFixed(1)}°`;
    case "axisSum[0]":
    case "axisSum[1]":
    case "axisSum[2]":
      return (value: number) => `${value / 10}%`;
    case "rcCommands[0]":
    case "rcCommands[1]":
    case "rcCommands[2]":
      return (value: number) => `${value}°/s`;
    case "rcCommands[3]":
      return (value: number) => `${value}%`;
    case "axisError[0]":
    case "axisError[1]":
    case "axisError[2]":
      return (value: number) => `${value}°/s`;
  }
  return (value: any) => `${value}`;
};
