import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class ProjectForId extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        const { match: { params: { id } } } = this.props;
        const { onGetProjectId } = this.props;
        let { history } = this.props;
        onGetProjectId(parseInt(id));
        history.push('/');
    }
    shouldComponentUpdate(nextProps, nextState) {
        const { match: { params: { id } } } = nextProps;
        const { onGetProjectId } = this.props;
        let { history } = this.props;
        onGetProjectId(id);
        history.push('/');
        return false;
    }
    render() {
        return <div>ProjectForId</div>;
    }
}

export default withRouter(ProjectForId);
