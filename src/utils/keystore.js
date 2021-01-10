import pbkdf2 from 'pbkdf2'
import aesjs from 'aes-js'
import Web3 from 'web3'


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
        return Web3.utils.isAddress(address)
    } catch (e) {
        return false
    }
}

export function encryptKeyStore(provider, privateKey, password) {
    const keystoreV3Json = provider.eth.accounts.encrypt(privateKey, password)
    return JSON.stringify(keystoreV3Json);
}

export function decryptKeyStore(provider, keystoreV3hex, password) {
    if (!password) {
        return false
    }
    const keystoreV3Json = JSON.parse(keystoreV3hex)
    const privateKey = provider.eth.accounts.decrypt(keystoreV3Json, password)
    return privateKey;
}
