import React from 'react';
import './App.css';

var CryptoJS = require("crypto-js");

export default class ServerHandler extends React.Component {

    constructor(props) {
        super(props);
        this.props.update({key:"serverHandler", value:this});
    }

    encryptMD5(str) {
        return CryptoJS.MD5(str, this.props.mobile).toString();
    }

    encryptAES(str) {
        if (this.decryptAES(str) === "") {
            str = CryptoJS.AES.encrypt(str, this.props.userKey).toString();
        }
        return str;
    }

    decryptAES(cryptic) {
        return CryptoJS.AES.decrypt(cryptic, this.props.userKey).toString(CryptoJS.enc.Utf8);
    }

    login() {
        var pass = this.encryptMD5(this.props.userKey);
        fetch(this.props.prefixUrl + '/login', {
            method: 'POST',
            body: JSON.stringify({
                mobile: this.props.mobile,
                password: pass,
            })
        }).then(response => response.json())
            .then(response => {
                console.log(response);
                if (response.status === "success") {
                    this.props.update({key: "pmData", value: response.data});
                    this.props.update({key: "authCode", value: response.authCode });
                    this.props.update({ key: "isLoggedIn", value: true });
                    this.props.update({ key: "userKey", value: pass})
                } else {
                    this.props.loginHandler.loginFailed();
                }
            });
    }

    query() {
        fetch(this.props.prefixUrl + '/pm/query', {
            method: 'POST',
            body: JSON.stringify({
                mobile: this.props.mobile,
                authCode: this.props.authCode,
            })
        }).then(response => response.json())
            .then(response => {
                console.log(response);
            });
    }


    insert(params) {
        fetch(this.props.prefixUrl + '/pm/insert', {
            method: 'POST',
            body: JSON.stringify({
                mobile: this.props.mobile,
                authCode: this.props.authCode,
                domain: params.domain,
                userName: this.encryptAES(params.userName),
                password: this.encryptAES(params.password),
                comment: params.comment,
                timeStamp: new Date().toString(),
            })
        }).then(response => response.json())
            .then(response => {
                console.log(response);
                params.id = response.create_id;
                params.mobile = this.props.mobile;
                params.timeStamp = new Date().toString();
        });
    }

    update(params) {
        fetch(this.props.prefixUrl + '/pm/update', {
            method: 'POST',
            body: JSON.stringify({
                id: params.id,
                authCode: this.props.authCode,
                mobile: this.props.mobile,
                domain: params.domain,
                userName: this.encryptAES(params.userName),
                password: this.encryptAES(params.password),
                comment: params.comment,
                timeStamp: new Date().toString(),
            })
        }).then(response => response.json())
        .then(response => {
            console.log(response);
        });
    }

    delete(params) {
        fetch(this.props.prefixUrl + '/pm/delete', {
            method: 'POST',
            body: JSON.stringify({
                id: params.id,
                authCode: this.props.authCode,
                mobile: this.props.mobile,
                timeStamp: new Date().toString(),
            })
        }).then(response => response.json())
        .then(response => {
            console.log(response);
        });
    }

    render() {
        return (
            <div>
            </div>
        );
    }
}

