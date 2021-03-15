import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tabs } from 'antd';
import classnames from 'classnames';

import NodeProperties from './properties/NodeProperties';
import MapProperties from './properties/MapProperties';
import ProjectProperties from './properties/ProjectProperties';
import Animations from './animations/Animations';
import Styles from './styles/Styles';
import DataSources from './datasources/DataSources';
import Icon from '../icon/Icon';
import CommonButton from '../common/CommonButton';

class ImageMapConfigurations extends Component {
	static propTypes = {
		canvasRef: PropTypes.any,
		selectedItem: PropTypes.object,
		onChange: PropTypes.func,
		onChangeAnimations: PropTypes.func,
		onChangeStyles: PropTypes.func,
		onChangeDataSources: PropTypes.func,
		animations: PropTypes.array,
		styles: PropTypes.array,
        dataSources: PropTypes.array,
        confActiveTab: PropTypes.any,
        onChangeTab: PropTypes.func
	};

    shouldComponentUpdate(nextProps, nextState) {
        const { onChangeTab } = this.props;
        if (this.props.selectedItem !== nextProps.selectedItem) {
            if (!nextProps.selectedItem) {
                onChangeTab('map');
            } else {
                onChangeTab('node');
            }
        }
        return true;
    }
    state = {
        collapse: false,
    };
	handlers = {
		onCollapse: () => {
			this.setState({
				collapse: !this.state.collapse,
			});
		},
	};

	render() {
		const {
			onChange,
			selectedItem,
			canvasRef,
			animations,
            globalAnimations,
			styles,
			dataSources,
			onChangeAnimations,
			onChangeStyles,
            onChangeDataSources,
            confActiveTab,
            projectId,
            canvasRefId,
		} = this.props;
		const { collapse } = this.state;
        const { onCollapse } = this.handlers;
        const { onChangeTab, projectConf } = this.props;
		const className = classnames('rde-editor-configurations', {
			minimize: collapse,
		});
        let animationsForCard = [];
        if (Array.isArray(globalAnimations) && Array.isArray(animations)) {
            animationsForCard = [...globalAnimations , ...animations];
        }
		return (
			<div className={className}>
				<CommonButton
					className="rde-action-btn"
					shape="circle"
					icon={collapse ? 'angle-double-left' : 'angle-double-right'}
					onClick={onCollapse}
					style={{ position: 'absolute', top: 16, right: 16, zIndex: 1000 }}
				/>
				<Tabs
					tabPosition="right"
					style={{ height: '100%' }}
					activeKey={confActiveTab}
					onChange={onChangeTab}
					tabBarStyle={{ marginTop: 60 }}
				>
                    <Tabs.TabPane tab={<Icon name="toolbox" />} key="project">
						<ProjectProperties onChange={onChange} projectConf={projectConf} projectId={projectId} />
					</Tabs.TabPane>
					<Tabs.TabPane tab={<Icon name="cog" />} key="map">
						<MapProperties onChange={onChange} canvasRef={canvasRef} animations={animationsForCard} projectId={projectId} />
					</Tabs.TabPane>
					<Tabs.TabPane tab={<Icon name="cogs" />} key="node">
						<NodeProperties onChange={onChange} selectedItem={selectedItem} canvasRef={canvasRef} />
					</Tabs.TabPane>
					<Tabs.TabPane tab={<Icon name="vine" prefix="fab" />} key="animations">
						<Animations 
                            animations={animations} 
                            globalAnimations={globalAnimations}
                            onChangeAnimations={onChangeAnimations} 
                            canvasRef={canvasRef} 
                            canvasRefId={canvasRefId}
                        />
					</Tabs.TabPane>
					<Tabs.TabPane tab={<Icon name="star-half-alt" />} key="styles">
						<Styles styles={styles} onChangeStyles={onChangeStyles} />
					</Tabs.TabPane>
					{/* <Tabs.TabPane tab={<Icon name="table" />} key="datasources">
                        <DataSources ref={(c) => { this.dataSourcesRef = c; }} dataSources={dataSources} onChangeDataSources={onChangeDataSources} />
                    </Tabs.TabPane> */}
				</Tabs>
			</div>
		);
	}
}

export default ImageMapConfigurations;
