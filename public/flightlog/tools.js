const semver = require("semver");
//Convert a hexadecimal string (that represents a binary 32-bit float) into a float
function hexToFloat(string) {
  const arr = new Uint32Array(1);
  arr[0] = parseInt(string, 16);

  const floatArr = new Float32Array(arr.buffer);

  return floatArr[0];
}

function uint32ToFloat(value) {
  const arr = new Uint32Array(1);
  arr[0] = value;

  const floatArr = new Float32Array(arr.buffer);

  return floatArr[0];
}

function asciiArrayToString(arr) {
  return String.fromCharCode.apply(null, arr);
}

function asciiStringToByteArray(s) {
  const bytes = [];

  for (let i = 0; i < s.length; i++) bytes.push(s.charCodeAt(i));

  return bytes;
}

function signExtend24Bit(u) {
  //If sign bit is set, fill the top bits with 1s to sign-extend
  return u & 0x800000 ? u | 0xff000000 : u;
}

function signExtend16Bit(word) {
  //If sign bit is set, fill the top bits with 1s to sign-extend
  return word & 0x8000 ? word | 0xffff0000 : word;
}

function signExtend14Bit(word) {
  //If sign bit is set, fill the top bits with 1s to sign-extend
  return word & 0x2000 ? word | 0xffffc000 : word;
}

function signExtend8Bit(byte) {
  //If sign bit is set, fill the top bits with 1s to sign-extend
  return byte & 0x80 ? byte | 0xffffff00 : byte;
}

function signExtend7Bit(byte) {
  //If sign bit is set, fill the top bits with 1s to sign-extend
  return byte & 0x40 ? byte | 0xffffff80 : byte;
}

function signExtend6Bit(byte) {
  //If sign bit is set, fill the top bits with 1s to sign-extend
  return byte & 0x20 ? byte | 0xffffffc0 : byte;
}

function signExtend5Bit(byte) {
  //If sign bit is set, fill the top bits with 1s to sign-extend
  return byte & 0x10 ? byte | 0xffffffe0 : byte;
}

function signExtend4Bit(nibble) {
  //If sign bit is set, fill the top bits with 1s to sign-extend
  return nibble & 0x08 ? nibble | 0xfffffff0 : nibble;
}

function signExtend2Bit(byte) {
  //If sign bit is set, fill the top bits with 1s to sign-extend
  return byte & 0x02 ? byte | 0xfffffffc : byte;
}

/**
 * Get the first index of needle in haystack, or -1 if it was not found. Needle and haystack
 * are both byte arrays.
 *
 * Provide startIndex in order to specify the first index to search from
 * @param haystack
 * @param needle
 * @returns {Number}
 */
function memmem(haystack, needle, startIndex) {
  for (
    let i = startIndex ? startIndex : 0;
    i <= haystack.length - needle.length;
    i++
  ) {
    let j;
    if (haystack[i] === needle[0]) {
      for (j = 1; j < needle.length && haystack[i + j] === needle[j]; j++);
      if (j === needle.length) return i;
    }
  }

  return -1;
}

function stringHasComma(string) {
  /***
   * Checks if the string contains at least one comma.
   *
   * string               is the string to check
   *
   * returns              true if at least one comma is found.
   *                      false if no comma is found.
   ***/
  return string.match(/.*,.*/) != null;
}

function parseCommaSeparatedString(string, length) {
  /***
   * Parse a comma separated string for individual values.
   *
   * string               is the comma separated string to parse
   * length (optional)    the returned array will be forced to be this long; extra fields will be discarded,
   *                      missing fields will be padded. if length is not specified, then array will be auto
   *                      sized.
   *
   * returns              if the string does not contain a comma, then the first integer/float/string is returned
   *                      else an Array is returned containing all the values up to the length (if specified)
   ***/
  const parts = string.split(",");
  let result, value;

  length = length || parts.length; // we can force a length if we like

  if (length < 2) {
    // this is not actually a list, just return the value
    value = parts.indexOf(".") ? parseFloat(parts) : parseInt(parts, 10);
    return isNaN(value) ? string : value;
  } else {
    // this really is a list; build an array
    result = new Array(length);
    for (let i = 0; i < length; i++) {
      if (i < parts.length) {
        value = parts[i].indexOf(".")
          ? parseFloat(parts[i])
          : parseInt(parts[i], 10);
        result[i] = isNaN(value) ? parts[i] : value;
      } else {
        result[i] = null;
      }
    }
    return result;
  }
}

/**
 * Find the index of `item` in `list`, or if `item` is not contained in `list` then return the index
 * of the next-smaller element (or 0 if `item` is smaller than all values in `list`).
 **/
function binarySearchOrPrevious(list, item) {
  let min = 0,
    max = list.length,
    mid,
    result = 0;

  while (min < max) {
    mid = Math.floor((min + max) / 2);

    if (list[mid] === item) return mid;
    else if (list[mid] < item) {
      // This might be the largest element smaller than item, but we have to continue the search right to find out
      result = mid;
      min = mid + 1;
    } else max = mid;
  }

  return result;
}

/**
 * Find the index of `item` in `list`, or if `item` is not contained in `list` then return the index
 * of the next-larger element (or the index of the last item if `item` is larger than all values in `list`).
 */
function binarySearchOrNext(list, item) {
  let min = 0,
    max = list.length,
    mid,
    result = list.length - 1;

  while (min < max) {
    mid = Math.floor((min + max) / 2);

    if (list[mid] === item) return mid;
    else if (list[mid] > item) {
      // This might be the smallest element larger than item, but we have to continue the search left to find out
      max = mid;
      result = mid;
    } else min = mid + 1;
  }

  return result;
}

function leftPad(string, pad, minLength) {
  string = "" + string;

  while (string.length < minLength) string = pad + string;

  return string;
}

function formatTime(msec, displayMsec) {
  // modify function to allow negative times.
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
    (hours ? leftPad(hours, "0", 2) + ":" : "") +
    leftPad(mins, "0", 2) +
    ":" +
    leftPad(secs, "0", 2) +
    (displayMsec ? "." + leftPad(ms, "0", 3) : "")
  );
}

function stringLoopTime(
  loopTime,
  pid_process_denom,
  unsynced_fast_pwm,
  motor_pwm_rate
) {
  let returnString = "";
  if (loopTime != null) {
    returnString =
      loopTime + "\u03BCS (" + parseFloat((1000 / loopTime).toFixed(3)) + "kHz";
    if (pid_process_denom != null) {
      returnString +=
        "/" +
        (parseFloat((1000 / (loopTime * pid_process_denom)).toFixed(3)) +
          "kHz");
      if (unsynced_fast_pwm != null) {
        returnString +=
          unsynced_fast_pwm === 0
            ? "/SYNCED"
            : motor_pwm_rate != null
            ? "/" + parseFloat((motor_pwm_rate / 1000).toFixed(3)) + "kHz"
            : "UNSYNCED";
      }
    }
    returnString += ")";
  }
  return returnString;
}

function stringTimetoMsec(input) {
  try {
    const matches = input.match(/([-])?([0-9]+)(\D)*([0-9]+)*\D*([0-9]+)*/);

    if (matches.length > 2) {
      // there is a placeholder - either : or .
      if (matches[3] === ":") {
        // time has been entered MM:SS.SSS
        return (
          (matches[1] ? -1 : 1) *
          (matches[2] * 60 * 1000000 +
            (matches[4] ? matches[4] : 0) * 1000000 +
            (matches[5] ? (matches[5] + "00").slice(0, 3) : 0) * 1000)
        );
      } else {
        return (
          (matches[1] ? -1 : 1) *
          (matches[2] * 1000000 +
            (matches[4] ? (matches[4] + "00").slice(0, 3) : 0) * 1000)
        );
      }
    } else return (matches[1] ? -1 : 1) * (matches[2] * 1000000);
  } catch (e) {
    return 0;
  }
}

function constrain(value, min, max) {
  return Math.max(min, Math.min(value, max));
}

function validate(value, defaultValue) {
  return value != null ? value : defaultValue;
}

const FIRMWARE_TYPE_BETAFLIGHT = 3;
const FIRMWARE_TYPE_CLEANFLIGHT = 2;

function firmwareGreaterOrEqual(sysConfig, bf_version, cf_version) {
  /***
   * Check if firmware version is higher or equal to requested version
   *
   * sysConfig            System config structure
   * bf_version           Betaflight version to check, e.g. '3.1.0' (string)
   * cf_version           Cleanflight version to check, e.g. '2.3.0' (optional, string)
   *
   * returns              True when firmware version is higher or equal to requested version
   *                      False when firmware version is lower than the requested version
   ***/
  if (cf_version === undefined) {
    return (
      sysConfig.firmwareType === FIRMWARE_TYPE_BETAFLIGHT &&
      semver.gte(sysConfig.firmwareVersion, bf_version)
    );
  } else {
    return (
      (sysConfig.firmwareType === FIRMWARE_TYPE_BETAFLIGHT &&
        semver.gte(sysConfig.firmwareVersion, bf_version)) ||
      (sysConfig.firmwareType === FIRMWARE_TYPE_CLEANFLIGHT &&
        semver.gte(sysConfig.firmwareVersion, cf_version))
    );
  }
}

module.exports = {
  hexToFloat,
  uint32ToFloat,
  asciiArrayToString,
  asciiStringToByteArray,
  signExtend14Bit,
  signExtend16Bit,
  signExtend24Bit,
  signExtend2Bit,
  signExtend4Bit,
  signExtend5Bit,
  signExtend6Bit,
  signExtend7Bit,
  signExtend8Bit,
  memmem,
  stringHasComma,
  parseCommaSeparatedString,
  binarySearchOrPrevious,
  binarySearchOrNext,
  leftPad,
  formatTime,
  stringLoopTime,
  stringTimetoMsec,
  constrain,
  validate,
  firmwareGreaterOrEqual,
};
