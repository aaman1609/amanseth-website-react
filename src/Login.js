import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Slide from '@material-ui/core/Slide';
import Grid from '@material-ui/core/Grid';
import './App.css';

export default class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loginFailed: false,
        };
        this.clickEvent = this.clickEvent.bind(this);
        this.props.update({key:"loginHandler", value:this});
    }

    clickEvent() {
        if (this.props.mobile.length > 0 && this.props.userKey.length > 0) {
            this.setState({ loginFailed: false });
            this.props.serverHandler.login();
        } else {
            this.setState({ loginFailed: true });
        }
    }

    loginFailed() {
        this.setState({ loginFailed: true });
    }
    
    handleMobileChange = event => {
        const re = /^[0-9\b]+$/;
        // if value is not blank, then test the regex
        if (event.target.value === '' || re.test(event.target.value)) {
            this.props.update({key:"mobile", value:event.target.value});
        }
    }

    handlePasswordChange = event => {
        const re = /[A-Za-z0-9]+$/;
        if (event.target.value === '' || re.test(event.target.value)) {
            this.props.update({key:"userKey", value:event.target.value});
        }
    }
    loginStatus() {
        if (this.state.loginFailed)
            return (<Slide direction="left" in={this.state.loginFailed} mountOnEnter unmountOnExit>
                <Typography variant="body2" color="textPrimary" align="left">
                    {'Incorrect password'}
                </Typography>
            </Slide>);
        
        else {
            return (<Box mt={4.5} ><div></div></Box>);
        }
    }

    render() {
        return (
            <Container component="main" maxWidth="xs">
                <Grid item xs={12} className="login-grid">
                    <div className="login-paper">
                        <Avatar className="avatar"> <LockOutlinedIcon /> </Avatar>
                        <Typography component="h1" variant="h5"> Sign in </Typography>
                        <form ref="form" className="login-form" noValidate>
                            <TextField value={this.props.mobile} onChange={this.handleMobileChange} inputProps={{ maxLength: 12 }}
                                variant="outlined" margin="normal" required fullWidth id="mobile" label="Mobile Number" name="mobile"
                                autoFocus />
                            <TextField value={this.props.userKey} onChange={this.handlePasswordChange} inputProps={{ maxLength: 50 }}
                                variant="outlined" margin="normal" required fullWidth name="userKey" label="Password" type="password"
                                id="userKey" />
                            { this.loginStatus() }
                            {/* <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me" /> */}
                            <Box mt={2}>
                                    <Button onClick={this.clickEvent} fullWidth variant="contained" color="primary" className="login-submit" >
                                    Sign In
                            </Button>
                            </Box>
                        </form>
                    </div>
                </Grid>
            </Container>
        );
    }
}
