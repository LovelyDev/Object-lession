import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import axios from 'axios';

import ImageMapEditor from '../components/imagemap/ImageMapEditor';
import WorkflowEditor from '../components/workflow/WorkflowEditor';
import Title from './Title';
import FlowEditor from '../components/flow/FlowEditor';
import FlowContainer from './FlowContainer';
import HexGrid from '../components/hexgrid/HexGrid';
import Projects from '../components/projects/Projects';

type EditorType = 'imagemap' | 'workflow' | 'flow' | 'hexgrid' | 'projects';

interface IState {
    activeEditor?: EditorType;
    projectId: any;
    projects: any;
}

class App extends Component<any, IState> {
	state: IState = {
        activeEditor: 'imagemap',
        projectId: null,
        projects: [
            { id: 1, name: "First Project" },
            { id: 2, name: "Second Project" },
            { id: 3, name: "Third Project" }
        ]
	};

	onChangeMenu = ({ key }) => {
        if (key === 'projects') {
            axios.get("https://api.mathcurious.com/projects")
            .then(res => {
                this.setState({projects: res.data});
            })
        }
		this.setState({
			activeEditor: key,
		});
    };
    
    onProjectClick = (id) => () => {
        this.setState({
            activeEditor: "imagemap",
            projectId: id
        })
    }

    onAddProjectClick = (projectName) => () => {
        axios.post("https://api.mathcurious.com/projects",
        {
            name: projectName
        })
        .then(res => {
            const { projects } = this.state;
            this.setState({projects: [...projects, res.data]});
        })
    }

	renderEditor = (activeEditor: EditorType) => {
        const { projects, projectId } = this.state;
        let props = {};
        if (projectId) {
            props = {projectId}
        }
		switch (activeEditor) {
			case 'imagemap':
				return <ImageMapEditor {...props}/>;
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
                    />;
		}
	};

	render() {
		const { activeEditor } = this.state;
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
				<div className="rde-title">
					<Title onChangeMenu={this.onChangeMenu} current={activeEditor} />
				</div>
				<FlowContainer>
					<div className="rde-content">{this.renderEditor(activeEditor)}</div>
				</FlowContainer>
			</div>
		);
	}
}

export default App;
