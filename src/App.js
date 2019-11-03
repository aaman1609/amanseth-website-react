import React from 'react';
import './App.css';
import ServerHandler from './ServerHandler';
import CookieManager from './CookieManager';
import AdminDashboardController from './AdminDashboardController';
import PasswordDashboardController from './PasswordDashboardController';
import CssBaseline from '@material-ui/core/CssBaseline';
import LoginController from './LoginController';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';
import JavascriptTimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import EncryptionManager from './EncryptionManager';

export default class App extends React.Component {

    constructor(props) {
        super(props);
        JavascriptTimeAgo.locale(en);
        this.props = props;
        this.state = {
            update: this.update,
            cookieManager: undefined,
            encryptionManager: undefined,
            serverHandler: undefined,
            loginController: undefined,
            currentController: "LoginController",
            mobile: "",
            userKey: "",
            authCode: "",
            pmData: undefined,
            adminData: undefined,
            updateDashboard: false,
            prefixUrl: "",
            urlDetermined: false,
            isAdminLoggedIn: false,
        };
        this.deleteCurrentUser = this.deleteCurrentUser.bind(this);
        this.getAdminDashboardLink = this.getAdminDashboardLink.bind(this);
        this.resetBrowser = this.resetBrowser.bind(this);
    }

    componentDidMount() {

    }

    update = event => {
        this.setState({ [event.key]: event.value });
    }

    getAdminDashboardLink() {
        if (this.state.isAdminLoggedIn) {
            var dashboardName = "Admin Dashboard";
            var selectedController = "AdminDashboardController";
            if (this.state.currentController === 'AdminDashboardController') {
                dashboardName = "Password Dashboard";
                selectedController = "PasswordDashboardController";
            }
            return (
                <Button className="admin-button" onClick={(e) => this.setState({ currentController: selectedController })} variant="contained" color="primary">
                    {dashboardName}
                </Button>
            )
        } else if (this.state.currentController !== 'LoginController') {
            return (
                <Button onClick={this.deleteCurrentUser} variant="contained" color="secondary">
                    Delete Account
                </Button>
            );
        }
    }

    deleteCurrentUser() {
        this.state.serverHandler.deleteUser(this.state);
        this.resetBrowser();
    }

    resetBrowser = () => {
        this.setState({
            update: this.update,
            currentController: "LoginController",
            mobile: "",
            userKey: "",
            authCode: "",
            pmData: undefined,
            adminData: undefined,
            updateDashboard: false,
            isAdminLoggedIn: false,
        });
    }

    render() {
        return (
            <React.Fragment>
                <CssBaseline />
                <CookieManager {...this.state} />
                <ServerHandler {...this.state} />
                <EncryptionManager {...this.state} />
                <div className="App">
                    <div className="Controller">
                        {this.state.currentController === 'LoginController' && <LoginController {...this.state} />}
                        {this.state.currentController === 'PasswordDashboardController' && <PasswordDashboardController {...this.state} />}
                        {this.state.currentController === 'AdminDashboardController' && <AdminDashboardController {...this.state} />}
                    </div>
                    <Box my={3}>
                    {this.getAdminDashboardLink()}
                    </Box>
                    <Box mb={.5}>
                        <Typography variant="body2" color="textSecondary" align="center">
                            {'Copyright © '}
                            <Link color="inherit" href="https://www.amanseth.com/">amanseth.com </Link>{' '}
                            {new Date().getFullYear()}
                            {'.'}
                        </Typography>
                    </Box>
                </div>
            </React.Fragment>
        );
    }
}