import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Menu, Tooltip, Modal } from 'antd';
import PropTypes from 'prop-types';
import i18n from 'i18next';
import axios from 'axios';
import { Flex } from '../components/flex';
import Icon from '../components/icon/Icon';
import { ShortcutHelp } from '../components/help';
import { API_URL } from '../config/env';

class Title extends Component {
	static propTypes = {
		currentMenu: PropTypes.string,
		onChangeMenu: PropTypes.func,
	};

	state = {
		visible: false,
	};

	componentDidMount() {
		if (window) {
			(window.adsbygoogle = window.adsbygoogle || []).push({});
		}
	}

	handlers = {
		goGithub: () => {
			window.open('https://github.com/salgum1114/react-design-editor');
		},
		goDocs: () => {
			window.open('https://salgum1114.github.io/react-design-editor/docs');
		},
		showHelp: () => {
			this.setState({
				visible: true,
			});
		},
	};
    onLogin = async () => {
        const res = await axios.post(`${API_URL}/auth/local`, {
            identifier: "lovely2187dev@outlook.com",
            password: "twentyaugust",
        });
        if(res?.data?.jwt) {
            // const token = encodeURI(res.data.jwt).replaceAll('.', "%2E").replaceAll('-', "%2D");
            const token = res.data.jwt;
            console.log("encoded token", token);
            let { history } = this.props;
            history.push(`/login/${token}`);
        }
    }
	render() {
        const { visible } = this.state;
        const { projectName, history } = this.props;
		return (
			<Flex
				style={{ background: 'linear-gradient(141deg,#23303e,#404040 51%,#23303e 75%)' }}
				flexWrap="wrap"
				flex="1"
				alignItems="center"
			>
				<Flex style={{ marginLeft: 8 }} flex="0 1 auto">
					<span style={{ color: '#fff', fontSize: 24, fontWeight: 500 }}>React Design Editor</span>
					<Tooltip title={i18n.t('action.go-github')} overlayStyle={{ fontSize: 16 }}>
						<Button
							className="rde-action-btn"
							style={{
								color: 'white',
							}}
							shape="circle"
							size="large"
							onClick={this.handlers.goGithub}
						>
							<Icon name="github" prefix="fab" size={1.5} />
						</Button>
					</Tooltip>
					<Tooltip title={i18n.t('action.go-docs')} overlayStyle={{ fontSize: 16 }}>
						<Button
							className="rde-action-btn"
							style={{
								color: 'white',
							}}
							shape="circle"
							size="large"
							onClick={this.handlers.goDocs}
						>
							<Icon name="book" prefix="fas" size={1.5} />
						</Button>
					</Tooltip>
					<Tooltip title={i18n.t('action.shortcut-help')} overlayStyle={{ fontSize: 16 }}>
						<Button
							className="rde-action-btn"
							style={{
								color: 'white',
							}}
							shape="circle"
							size="large"
							onClick={this.handlers.showHelp}
						>
							<Icon name="question" prefix="fas" size={1.5} />
						</Button>
					</Tooltip>
				</Flex>
				<Flex style={{ marginLeft: 88 }}>
					<Menu
						mode="horizontal"
						theme="dark"
						style={{ background: 'transparent', fontSize: '16px' }}
						onClick={this.props.onChangeMenu}
						selectedKeys={[this.props.current]}
					>
						{projectName && <Menu.Item key="imagemap" style={{ color: '#fff' }}>
							{projectName}
						</Menu.Item>
                        }
						<Menu.Item key="workflow" style={{ color: '#fff' }}>
							{i18n.t('workflow.workflow')}
						</Menu.Item>
						<Menu.Item key="projects" style={{ color: '#fff' }}>
							{i18n.t('Projects')}
						</Menu.Item>
                        <Menu.Item key="login" style={{ color: '#fff' }} onClick={this.onLogin}>
							{i18n.t('Login')}
						</Menu.Item>
						{/* <Menu.Item key="flow" style={{ color: '#fff' }}>{i18n.t('flow.flow')}</Menu.Item> */}
						{/* <Menu.Item key="hexgrid" style={{ color: '#fff' }}>
							{i18n.t('hexgrid.hexgrid')}
						</Menu.Item> */}
					</Menu>
				</Flex>
				<Flex flex="1" justifyContent="flex-end">
					<ins
						className="adsbygoogle"
						style={{ display: 'inline-block', width: 600, height: 60 }}
						data-ad-client="ca-pub-8569372752842198"
						data-ad-slot="5790685139"
					/>
				</Flex>
				<Modal
					visible={visible}
					onCancel={() => this.setState({ visible: false })}
					closable
					footer={null}
					width="50%"
				>
					<ShortcutHelp />
				</Modal>
			</Flex>
		);
	}
}

export default withRouter(Title);
