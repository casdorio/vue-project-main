// casdorio_crypto.js - Alternative version keeping jQuery wrapper

// Define functions outside the jQuery wrapper for export
const ENCRYPTION_STATUS = 'false';
const ENCRYPTION_KEY = 'a3f5c89e0e2a59e8a4bc71e134b423b7c4f5e7f5e7e8f3b9c3e1e9c5a7d2b5f9';

const generateIV = () => {
    return CryptoJS.lib.WordArray.random(16);
};

const parseKey = (key) => {
    return CryptoJS.enc.Hex.parse(key);
};

export const encryptData = (data) => {
    if (ENCRYPTION_STATUS === 'false') {
        return data;
    }
    const iv = generateIV();
    const encryptionKey = ENCRYPTION_KEY;
    const keyHex = parseKey(encryptionKey);

    let dataToEncrypt;
    if (data instanceof FormData) {
        const formDataObject = Object.fromEntries(data.entries());
        dataToEncrypt = JSON.stringify(formDataObject);
    } else if (Array.isArray(data)) {
        dataToEncrypt = JSON.stringify(data);
    } else if (typeof data === 'object' && data !== null) {
        dataToEncrypt = JSON.stringify(data);
    } else if (typeof data === 'string') {
        dataToEncrypt = data;
    } else {
        throw new Error('Unsupported data type for encryption');
    }

    const encrypted = CryptoJS.AES.encrypt(
        dataToEncrypt,
        keyHex,
        {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        }
    );

    const ivBase64 = CryptoJS.enc.Base64.stringify(iv);
    const encryptedTextBase64 = encrypted.ciphertext.toString(CryptoJS.enc.Base64);
    return `${ivBase64}:${encryptedTextBase64}`;
};

export const decryptData = (encryptedData) => {
    if (ENCRYPTION_STATUS === 'false') {
        return encryptedData;
    }

    if (!encryptedData) {
        console.error('Dados criptografados são nulos ou indefinidos');
        return encryptedData;
    }

    if (typeof encryptedData !== 'string') {
        console.warn('Dados criptografados não são uma string:', typeof encryptedData, encryptedData);
        return encryptedData;
    }

    if (!encryptedData.includes(':')) {
        console.warn('Formato de dados criptografados inválido (falta :):', encryptedData);
        return encryptedData;
    }

    try {
        const encryptionKey = ENCRYPTION_KEY;
        const keyHex = parseKey(encryptionKey);
        const [ivBase64, encryptedTextBase64] = encryptedData.split(':');

        if (!ivBase64 || !encryptedTextBase64) {
            console.error('IV ou dados criptografados estão ausentes');
            return encryptedData;
        }

        const iv = CryptoJS.enc.Base64.parse(ivBase64);
        const encryptedDataBytes = CryptoJS.enc.Base64.parse(encryptedTextBase64);

        const decryptedData = CryptoJS.AES.decrypt(
            { ciphertext: encryptedDataBytes },
            keyHex,
            { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
        );
       
        const decryptedString = decryptedData.toString(CryptoJS.enc.Utf8);
        
        if (!decryptedString) {
            console.error('Falha na descriptografia - string vazia');
            return encryptedData;
        }            
        
        return JSON.parse(decryptedString);
        
    } catch (error) {
        console.error('Erro detalhado na descriptografia:', error);
        console.error('Dados que causaram o erro:', encryptedData);
        return encryptedData;
    }
};

// jQuery wrapper for backward compatibility and initialization
$(function () {
    // Make functions available globally if needed
    window.encryptData = encryptData;
    window.decryptData = decryptData;
    
    // Any other jQuery-specific initialization code can go here
});