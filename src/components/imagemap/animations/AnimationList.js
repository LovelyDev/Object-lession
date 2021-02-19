import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List, Button, Avatar } from 'antd';

import Icon from '../../icon/Icon';

class AnimationList extends Component {
	static propTypes = {
		animations: PropTypes.array,
        globalAnimations: PropTypes.array,
		onEdit: PropTypes.func,
		onDelete: PropTypes.func,
	};

	render() {
        const { 
            animations, 
            globalAnimations,
            onEdit, 
            onDelete 
        } = this.props;
        const gCount = globalAnimations ? globalAnimations.length : 0;
        let source = [];
        if (globalAnimations && animations) {
            source = [...globalAnimations, ...animations];
        }
		return (
			<List
				dataSource={source}
				renderItem={(animation, index) => {
					const actions = [
						<Button
							className="rde-action-btn"
							shape="circle"
							onClick={() => {
                                onEdit(animation, index, animation.isGlobal);
							}}
						>
							<Icon name="edit" />
						</Button>,
						<Button
							className="rde-action-btn"
							shape="circle"
							onClick={() => {
                                if (animation.isGlobal) {
                                    onDelete('global', index);
                                } else {
                                    onDelete('', index - gCount);
                                }
							}}
						>
							<Icon name="times" />
						</Button>,
					];
					return (
						<List.Item actions={actions}>
							<List.Item.Meta
								avatar={<Avatar>{index + 1}</Avatar>}
								title={animation.name}
							/>
						</List.Item>
					);
				}}
			/>
		);
	}
}

export default AnimationList;
