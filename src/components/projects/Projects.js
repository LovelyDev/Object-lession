import React, { Component } from 'react';
import { Input } from 'antd';
import i18n from 'i18next';
import { CommonButton } from '../common';
import Scrollbar from '../common/Scrollbar';
import Container from '../common/Container';
import './Projects.css';

class Project extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { name, onProjectClick } = this.props;
        const { id } = this.props;
        return (
            <div
                className="project-item"
                onClick={onProjectClick(id)}
            >
                {name}
            </div>
        )
    }
}

class Projects extends Component {
    constructor(props) {
        super(props);
        this.state = {
            projectName: ""
        }
    }
    projectNameChange = (e) => {
        this.setState({projectName: e.target.value});
    }
    render() {
        const { projects, onProjectClick, onAddProjectClick } = this.props;
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
                                />)
                            }
                        </div>
                    </div>
                </Scrollbar>
            </div>
        )
        return <Container title={title} content={content} />
    }
}

export default Projects;
