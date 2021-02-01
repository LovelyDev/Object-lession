import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class Login extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        const { match: { params: { token } } } = this.props;
        console.log("received token", token)
        let { history } = this.props;
        localStorage.setItem("Token", token);
        history.push('/');
    }
    render() {
        return <div>Token is successfully stored in localStorage</div>
    }
}
export default withRouter(Login);
