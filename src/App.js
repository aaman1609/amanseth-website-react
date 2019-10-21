import React from 'react';
import './App.css';
import ServerHandler from './ServerHandler';
import PasswordDashboard from './PasswordDashboard';
import CssBaseline from '@material-ui/core/CssBaseline';
import Login from './Login';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            update: this.update,
            serverHandler: undefined,
            loginHandler: undefined,
            isLoggedIn: false,
            mobile: "",
            userKey: "",
            authCode: "",
            pmData: undefined,
            updateDashboard: false,
            // prefixUrl: "http://localhost:8080",
            prefixUrl: "",
        };
    }

    componentDidMount() {
    }

    update = event => {
        this.setState({ [event.key]: event.value });
    }

    render() {
        return (
            <React.Fragment>
                <CssBaseline />
                <ServerHandler {...this.state} />
                <div className="App">
                    {this.state.isLoggedIn === false && <Login {...this.state} />}
                    {this.state.isLoggedIn && <PasswordDashboard {...this.state} />}
                    <Box mt={8}>
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