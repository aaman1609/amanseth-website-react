import React from 'react';
import Cookies from 'universal-cookie';
import ls from 'local-storage'


export default class CookieManager extends React.Component {

    constructor(props) {
        super(props);
        const cookies = new Cookies();
        this.state = {
            cookies: cookies,
        }
        this.props.update({ key: "cookieManager", value: this });
    }

    componentDidMount() {
        if (this.loadCookie("userName")) {
            this.props.update({ key: "mobile", value: this.loadCookie("userName") });
            this.props.update({ key: "isuserNameloadedFromCookie", value: true });
        }
    }

    saveCookie(key, value) {
        ls.set(key, value);
    }

    loadCookie(key) {
        return ls.get(key);
    }

    render() {
        return (
            <div>
            </div>
        );
    }
}

