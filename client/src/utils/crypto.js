import CryptoJS from 'crypto-js';

function encryptSHA256(data, secretKey) {
    const secretKeyWordArray = CryptoJS.enc.Utf8.parse(secretKey);
    return CryptoJS.AES.encrypt(data, secretKeyWordArray, {
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
        iv: CryptoJS.lib.WordArray.create([0]),
    }).toString();
}

function decryptSHA256(encryptedData, secretKey) {
    const secretKeyWordArray = CryptoJS.enc.Utf8.parse(secretKey);
    const decrypted = CryptoJS.AES.decrypt(encryptedData, secretKeyWordArray, {
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
        iv: CryptoJS.lib.WordArray.create([0]), // Vector khởi tạo IV phải giống như lúc mã hóa
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
}

export function decodeEncryptedValue(encryptedValue, secretKey) {
    const base64Decoded = decodeURIComponent(encryptedValue);
    const encryptedResult = CryptoJS.enc.Base64.parse(base64Decoded).toString(CryptoJS.enc.Utf8);
    const decryptedResult = decryptSHA256(encryptedResult, secretKey);
    return decryptedResult;
}

export function generateEncryptedValue(paymentId, secretKey) {
    const concatString = paymentId.toString(); // Chỉ sử dụng paymentId
    const encryptedResult = encryptSHA256(concatString, secretKey);
    const base64Result = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(encryptedResult));
    const percentEncodedResult = encodeURIComponent(base64Result);
    return percentEncodedResult;
}


// const secretKey = "EiD0BVQle0xFjZvYOupQsXCWAcAwBaTjlZ7G7rryNos=";
// const result = generateEncryptedValue(15680298, secretKey); // Chỉ truyền vào paymentId
// console.log('Encrypted and Percent Encoded Result:', result);
// const decryptedValue = decodeEncryptedValue(result, secretKey);
// console.log('Decrypted Result:', decryptedValue);