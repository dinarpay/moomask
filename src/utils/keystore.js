import pbkdf2 from 'pbkdf2'
import aesjs from 'aes-js'
import Web3 from 'web3'

import { v4 as uuidv4} from 'uuid'

// Convert a hex string to a byte array
function hexToBytes(hex) {
  const bytes = []
  for (let c = 0; c < hex.length; c += 2) {
    bytes.push(parseInt(hex.substr(c, 2), 16));
  }
  return bytes;
}

// Convert a byte array to a hex string
function bytesToHex(bytes) {
    for (var hex = [], i = 0; i < bytes.length; i++) {
        var current = bytes[i] < 0 ? bytes[i] + 256 : bytes[i];
        hex.push((current >>> 4).toString(16));
        hex.push((current & 0xF).toString(16));
    }
    return hex.join("");
}

/**
 * Converts a byte array to string
 *
 * @param {Uint8Array} arr byte array
 * @returns {string}
 */
function bytesToString(arr) {
    if (typeof arr === 'string') {
      return arr;
    }
    let str = '',
      _arr = arr;
    for (let i = 0; i < _arr.length; i++) {
      let one = _arr[i].toString(2), v = one.match(/^1+?(?=0)/);
      if (v && one.length === 8) {
        let bytesLength = v[0].length;
        let store = _arr[i].toString(2).slice(7 - bytesLength);
        for (let st = 1; st < bytesLength; st++) {
          store += _arr[st + i].toString(2).slice(2);
        }
        str += String.fromCharCode(parseInt(store, 2));
        i += bytesLength - 1;
      } else {
        str += String.fromCharCode(_arr[i]);
      }
    }
    return str;
  }

function stringToBytes(str) {
    const bytes = [];
    const len = str.length;
    let c;
    for (let i = 0; i < len; i++) {
      c = str.charCodeAt(i);
      if (c >= 0x010000 && c <= 0x10FFFF) {
        bytes.push(((c >> 18) & 0x07) | 0xF0);
        bytes.push(((c >> 12) & 0x3F) | 0x80);
        bytes.push(((c >> 6) & 0x3F) | 0x80);
        bytes.push((c & 0x3F) | 0x80);
      } else if (c >= 0x000800 && c <= 0x00FFFF) {
        bytes.push(((c >> 12) & 0x0F) | 0xE0);
        bytes.push(((c >> 6) & 0x3F) | 0x80);
        bytes.push((c & 0x3F) | 0x80);
      } else if (c >= 0x000080 && c <= 0x0007FF) {
        bytes.push(((c >> 6) & 0x1F) | 0xC0);
        bytes.push((c & 0x3F) | 0x80);
      } else {
        bytes.push(c & 0xFF);
      }
    }
    return bytes;
  }

export function encryptKey(password, salt) {
    return pbkdf2.pbkdf2Sync(password, salt, 1, 256 / 8, 'sha512')
}

export function encryptString(password, hexString) {
    const textBytes = aesjs.utils.utf8.toBytes(hexString)
    const aesCtr = new aesjs.ModeOfOperation.ctr(password)
    const encrypted = aesCtr.encrypt(textBytes)

    return {
        bytes: encrypted,
        hex: aesjs.utils.hex.fromBytes(encrypted),
    }
}

export function decryptString(password, salt, hexString) {
    const key = encryptKey(password, salt)
    const encryptedBytes = aesjs.utils.hex.toBytes(hexString)
    const aesCtr = new aesjs.ModeOfOperation.ctr(key)
    const decryptedBytes = aesCtr.decrypt(encryptedBytes)

    return aesjs.utils.utf8.fromBytes(decryptedBytes)
}

export function validatePrivateKey(address) {
    try {
        //const address = pkToAddress(privateKey)
        return Web3.utils.isAddress(address)
    } catch (e) {
        return false
    }
}

export function encryptKeyStore(password, privateKey, address) {
    const salt = uuidv4()
    const encryptedKey = encryptKey(password, salt)
    const { hex } = encryptString(encryptedKey, privateKey)

    const data = {
        version: 1,
        key: hex,
        address: address,
        salt,
    }

    return bytesToHex(stringToBytes(JSON.stringify(data)))
}

export function decryptKeyStore(password, keystore) {
    if (!password) {
        return false
    }
    const { key, address, salt } = JSON.parse(bytesToString(hexToBytes(keystore)))
    const privateKey = decryptString(password, salt, key)

    return {
        address,
        privateKey
    }
}
