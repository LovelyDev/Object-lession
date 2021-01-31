import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ImageMapEditor from '../components/imagemap/ImageMapEditor';
import WorkflowEditor from '../components/workflow/WorkflowEditor';
import Title from './Title';
import FlowEditor from '../components/flow/FlowEditor';
import FlowContainer from './FlowContainer';
import HexGrid from '../components/hexgrid/HexGrid';
import Projects from '../components/projects/Projects';
import Login from '../components/auth/Login';
import ProjectForId from '../components/projects/ProjectForId';
import { API_URL } from '../config/env';
import axios from '../config/axios';
import { getTokenFromLocal } from '../helpers/utils';
const { getData, postData, putData, deleteData } = axios;

type EditorType = 'imagemap' | 'workflow' | 'flow' | 'hexgrid' | 'projects';

interface IState {
    activeEditor?: EditorType;
    projectId: any;
    projects: any;
    projectName: any;
    token: any;
}

class App extends Component<any, IState> {
	state: IState = {
        activeEditor: 'projects',
        projectId: null,
        projects: [],
        projectName: null,
        token: null
	};
    componentDidMount() {
        const token = getTokenFromLocal();
        console.log("token for call", token);
        if (!token) return;
        getData('/projects')
        .then(res => {
            this.setState({projects: res.data, token});
        })
    }
	onChangeMenu = ({ key }) => {
        if (key === 'projects') {
            const { token } = this.state;
            getData('/projects')
            .then(res => {
                this.setState({projects: res.data});
                console.log("project list is refetched", res.data);
            })
        }
		this.setState({
			activeEditor: key,
		});
    };
    
    onProjectClick = (id) => () => {
        const { projects } = this.state;
        let projectName = null;
        for (let i = 0; i < projects.length; i++) {
            const e = projects[i];
            if (e.id === id) {
                projectName = e.name;
                break;
            }
        }
        this.setState({
            activeEditor: "imagemap",
            projectId: id,
            projectName
        })
    }

    onAddProjectClick = (projectName) => () => {
        postData('/projects', {
            name: projectName
        })
        .then(res => {
            const { projects } = this.state;
            this.setState({projects: [...projects, res.data]});
        })
    }

    onProjectNameChange = (projectName) => {
        this.setState({projectName});
    }

    onDeleteProjectClick = async (id) => {
        await deleteData(`/projects/${id}`)
        const { projects } = this.state;
        const newProjects = projects.filter(project => project.id !== id)
        this.setState({projects: [...newProjects]});
        return true;
    }

    onDuplicateProjectClick = async (id) => {
        const res = await getData(`/projects/${id}`);
        const { name, project_json } = res.data;
        const copiedProject = await postData('/projects', {
            name: `<${name}> Copy`,
            project_json
        });
        const { projects } = this.state;
        this.setState({projects: [...projects, copiedProject.data]});
        return true;
    }

    onGetProjectId = (id) => {
        const { projects } = this.state;
        console.log("onGetProjectId_projects", projects);
        let projectName = null;
        for (let i = 0; i < projects.length; i++) {
            const e = projects[i];
            if (e.id === id) {
                projectName = e.name;
                break;
            }
        }
        console.log("onGetProjectId", projectName);
        this.setState({ projectId: id, activeEditor: 'imagemap', projectName });
    }

	renderEditor = (activeEditor: EditorType) => {
        const { projects, projectId } = this.state;
        let imageMapProps = {};
        if (projectId) {
            imageMapProps = { projectId };
        }
		switch (activeEditor) {
			case 'imagemap':
                return <ImageMapEditor
                        onProjectNameChange={this.onProjectNameChange}
                        {...imageMapProps} />;
			case 'workflow':
				return <WorkflowEditor />;
			case 'flow':
				return <FlowEditor />;
			case 'hexgrid':
                return <HexGrid />;
            case 'projects':
                return <Projects
                    projects={projects}
                    onProjectClick={this.onProjectClick}
                    onAddProjectClick={this.onAddProjectClick}
                    onDeleteProjectClick={this.onDeleteProjectClick}
                    onDuplicateProjectClick={this.onDuplicateProjectClick}
                />;
		}
	};

	render() {
        const { activeEditor, projectName } = this.state;
		return (
			<div className="rde-main">
				<Helmet>
					<meta charSet="utf-8" />
					<meta name="viewport" content="width=device-width, initial-scale=1.0" />
					<meta
						name="description"
						content="React Design Editor has started to developed direct manipulation of editable design tools like Powerpoint, We've developed it with react.js, ant.design, fabric.js "
					/>
					<link rel="manifest" href="./manifest.json" />
					<link rel="shortcut icon" href="./favicon.ico" />
					<link rel="stylesheet" href="https://fonts.googleapis.com/earlyaccess/notosanskr.css" />
					<title>React Design Editor</title>
					<script async={true} src="https://www.googletagmanager.com/gtag/js?id=UA-97485289-3" />
					<script>
						{`
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', 'UA-97485289-3');
                        `}
					</script>
					<script async={true} src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js" />
				</Helmet>
                <Router>
                    <div className="rde-title">
                        <Title onChangeMenu={this.onChangeMenu} current={activeEditor} projectName={projectName} />
                    </div>
                    <FlowContainer>
                        {/* <div className="rde-content">{this.renderEditor(activeEditor)}</div> */}
                        <div className="rde-content">
                            <Switch>
                                <Route exact path="/login/:token" component={Login} />
                                <Route exact path="/projects/:id" component={() => <ProjectForId onGetProjectId={this.onGetProjectId} />} />
                                <Route path="/" component={() => this.renderEditor(activeEditor)} />
                            </Switch>
                            
                        </div>
                    </FlowContainer>
                    <ToastContainer
                        position="bottom-center"
                        autoClose={5000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                    />
                </Router>
			</div>
        );
	}
}

export default App;
