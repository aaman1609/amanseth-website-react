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
import SimpleCard from './Components/SimpleCard.js';

export default class LoginController extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loginFailed: false,
        };
        this.loginButtonClick = this.loginButtonClick.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.props.update({key:"loginController", value:this});
    }

    componentDidMount() {
    }

    loginButtonClick() {
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

    handleKeyPress(target) {
        if(target.charCode === 13){
            this.loginButtonClick();
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

    getcontent() {
        return (
            <Grid item xs={12} className="login-grid">
                <div className="login-paper">
                    <Avatar > <LockOutlinedIcon /> </Avatar>
                    <Typography component="h1" variant="h5"> Sign in </Typography>
                        <Box mt={3}>
                            <form ref="form" noValidate>
                                <TextField value={this.props.mobile} onChange={this.handleMobileChange} inputProps={{ maxLength: 12 }}
                                    variant="outlined" margin="normal" required fullWidth id="mobile" label="Mobile Number" name="mobile"
                                    onKeyPress={this.handleKeyPress} />
                                <TextField value={this.props.userKey} onChange={this.handlePasswordChange} inputProps={{ maxLength: 50 }}
                                    variant="outlined" margin="normal" required fullWidth name="userKey" label="Password" type="password"
                                    id="userKey" onKeyPress={this.handleKeyPress} autoFocus />
                                {this.loginStatus()}
                                {/* <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me" /> */}
                                <Box mt={2}>
                                    <Button onClick={this.loginButtonClick} fullWidth variant="contained" color="primary" >
                                        Sign In
                                    </Button>
                                </Box>
                            </form>
                        </Box>
                 </div>
            </Grid>
        );
    }

    render() {
        return (
            <Container component="main" maxWidth="xs" >
                <SimpleCard contentElements={this.getcontent()} ></SimpleCard>
            </Container>
        );
    }
}
