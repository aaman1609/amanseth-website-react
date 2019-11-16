import React from 'react';
var CryptoJS = require("crypto-js");

export default class EncryptionManager extends React.Component {

    constructor(props) {
        super(props);
        this.props.update({ key: "encryptionManager", value: this });
    }

    encryptMD5(str) {
        return CryptoJS.MD5(str, this.props.mobile).toString();
    }

    encryptAES(str) {
        if (this.decryptAES(str) === str) {
            str = CryptoJS.AES.encrypt(str, this.props.userKey).toString();
        }
        return str;
    }

    decryptAES(cryptic) {
        try {
            var str = CryptoJS.AES.decrypt(cryptic, this.props.userKey).toString(CryptoJS.enc.Utf8);
            if (str === "") {
                return cryptic;
            }
            return str;
        } catch (e) {
            console.log(e);
        }
        return cryptic;
    }

    render() {
        return (
            <div>
            </div>
        );
    }
}

