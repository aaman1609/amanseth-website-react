import React from 'react';


export default class ServerHandler extends React.Component {

    constructor(props) {
        super(props);
        this.props.update({ key: "serverHandler", value: this });
        if (this.props.urlDetermined === false) {
            this.props.update({ key: "urlDetermined", value: !this.props.urlDetermined });
            this.ping("http://localhost:8080");
        }
    }

    ping(url) {
        fetch(url + '/ping', {
            method: 'GET'
        }).then(response => response.json())
            .then(response => {
                if (response.status === "success") {
                    this.props.update({ key: "prefixUrl", value: url });
                }
            });
    }


    login() {
        var pass = this.props.encryptionManager.encryptMD5(this.props.userKey);
        fetch(this.props.prefixUrl + '/login', {
            method: 'POST',
            body: JSON.stringify({
                mobile: this.props.mobile,
                password: pass,
                timeStamp: new Date().toString(),
            })
        }).then(response => response.json())
            .then(response => {
                if (response.status === "success") {
                    this.props.update({ key: "userKey", value: pass });
                    this.props.update({ key: "pmData", value: response.data ? response.data : [] });
                    this.props.update({ key: "authCode", value: response.authCode });
                    this.props.update({ key: "currentController", value: "PasswordDashboardController" });
                    this.props.cookieManager.saveCookie("userName", this.props.mobile);
                    if (response.adminData) {
                        this.props.update({ key: "isAdminLoggedIn", value: true });
                        this.props.update({ key: "adminData", value: response.adminData ? response.adminData : [] });
                    }
                } else {
                    this.props.loginController.loginFailed();
                }
            });
    }


    query() {
        fetch(this.props.prefixUrl + '/pm/query', {
            method: 'POST',
            body: JSON.stringify({
                mobile: this.props.mobile,
                authCode: this.props.authCode,
                timeStamp: new Date().toString(),
            })
        }).then(response => response.json())
            .then(response => {
            });
    }


    insert(params) {
        fetch(this.props.prefixUrl + '/pm/insert', {
            method: 'POST',
            body: JSON.stringify({
                mobile: this.props.mobile,
                authCode: this.props.authCode,
                domain: params.domain,
                userName: params.userName,
                password: params.password,
                comment: params.comment,
                timeStamp: new Date().toString(),
            })
        }).then(response => response.json())
            .then(response => {
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
                userName: params.userName,
                password: params.password,
                comment: params.comment,
                timeStamp: new Date().toString(),
            })
        }).then(response => response.json())
            .then(response => {
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
            });
    }

    deleteUser(params) {
        fetch(this.props.prefixUrl + '/pm/deleteUser', {
            method: 'POST',
            body: JSON.stringify({
                id: params.mobile,
                authCode: this.props.authCode,
                mobile: this.props.mobile,
                timeStamp: new Date().toString(),
            })
        }).then(response => response.json())
            .then(response => {
            });
    }

    render() {
        return (
            <div>
            </div>
        );
    }
}

