import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Input } from 'antd';
import i18n from 'i18next';
import { CommonButton } from '../common';
import Scrollbar from '../common/Scrollbar';
import Container from '../common/Container';
import axios from '../../config/axios';
const { getData } = axios;
import './Projects.css';

class Project extends Component {
    constructor(props) {
        super(props);
        this.state = {
            coverImage: './images/sample/transparentBg.png'
        }
    }
    componentDidMount() {
        const { id } = this.props;
        getData(`/projects/${id}`)
        .then(res => {
            if (!res.data.project_json) return;
            const { coverImage } = res.data.project_json;
            console.log("coverImage is fetched", coverImage);
            if (!coverImage) return;
            this.setState({ coverImage });
        });
    }
    onDeleteProjectClick = async () => {
        const { id } = this.props;
        const { onDeleteProjectClick, showLoading } = this.props;
        showLoading(true);
        const res = await onDeleteProjectClick(id);
        if (res) {
            showLoading(false);
        }
    }
    onDuplicateProjectClick = async () => {
        const { id } = this.props;
        const { onDuplicateProjectClick, showLoading } = this.props;
        showLoading(true);
        const res = await onDuplicateProjectClick(id);
        if (res) {
            showLoading(false);
        }
    }
    render() {
        const { name, onProjectClick } = this.props;
        const { id } = this.props;
        let { history } = this.props;
        const { coverImage } = this.state;
        return (<div className="project-item">
                <div className="project-item-body">
                    <img src={coverImage} className="project-item-cover-image" />
                    <div className="project-item-header">
                        <CommonButton
                            className="rde-action-btn"
                            shape="circle"
                            icon="arrow-right"
                            tooltipTitle={i18n.t('Display')}
                            style={{fontSize: 35, height: "auto", margin: "0 10px 0 0"}}
                            onClick={() => {
                                onProjectClick(id);
                                history.push(`/projects/${id}`);
                            }}
                        />
                    </div>
                    <div className="project-item-content">
                        <CommonButton
                            className="rde-action-btn"
                            shape="circle"
                            icon="trash"
                            tooltipTitle={i18n.t('action.delete')}
                            onClick={this.onDeleteProjectClick}
                        />
                        <CommonButton
                            className="rde-action-btn duplicate-btn"
                            shape="circle"
                            icon="clone"
                            tooltipTitle={i18n.t('Duplicate')}
                            onClick={this.onDuplicateProjectClick}
                        />
                    </div>
                </div>
                <span>{name}</span>
            </div>
        )
    }
}

class Projects extends Component {
    constructor(props) {
        super(props);
        this.state = {
            projectName: "",
            loading: false
        }
    }
    projectNameChange = (e) => {
        this.setState({projectName: e.target.value});
    }
    showLoading = (status) => {
        this.setState({ loading: status });
    }
    render() {
        const { onProjectClick, onAddProjectClick, onDeleteProjectClick, onDuplicateProjectClick } = this.props;
        const { projects } = this.props;
        let { history } = this.props;
        const { loading } = this.state;
        const title = (
            <div className="project-list-header">
                <span>Project List</span>
                <CommonButton
                    className="rde-action-btn"
                    shape="circle"
                    icon="plus"
                    tooltipTitle={i18n.t('Add Project')}
                    tooltipPlacement="bottomRight"
                    style={{fontSize: 43, height: "auto", marginLeft: 60, marginRight: 30}}
                    onClick={onAddProjectClick(this.state.projectName)}
                />
                <Input placeholder="Project Name" style={{width: 200}} onChange={this.projectNameChange} value={this.state.projectName} />
            </div>
        )
        const content = (
            <div className="rde-editor-items project-list-panel">
                <Scrollbar>
                    <div>
                        <div className="project-list">
                            {
                                projects.map(project => <Project
                                    key={project.id}
                                    id={project.id}
                                    name={project.name}
                                    onProjectClick={onProjectClick}
                                    onDeleteProjectClick={onDeleteProjectClick}
                                    onDuplicateProjectClick={onDuplicateProjectClick}
                                    showLoading={this.showLoading}
                                    history={history}
                                />)
                            }
                        </div>
                    </div>
                </Scrollbar>
            </div>
        )
        return <Container title={title} content={content} loading={loading} />
    }
}

export default withRouter(Projects);
