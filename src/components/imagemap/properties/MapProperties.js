import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Card } from 'antd';

import PropertyDefinition from './PropertyDefinition';
import Scrollbar from '../../common/Scrollbar';

class MapProperties extends Component {
	static propTypes = {
		canvasRef: PropTypes.any,
	};

	render() {
		const { canvasRef, form } = this.props;
		const showArrow = false;
		if (canvasRef) {
			return (
				<Scrollbar>
					<Form layout="horizontal">
                        {Object.keys(PropertyDefinition.map).map(key => {
                            return (
                                <div key={key} className="site-card-border-less-wrapper">
                                    <Card key={key} title={PropertyDefinition.map[key].title}>
                                        {PropertyDefinition.map[key].component.render(
                                            canvasRef,
                                            form,
                                            canvasRef.handler.workarea,
                                        )}
                                    </Card>
                                </div>
                            );
                        })}
					</Form>
				</Scrollbar>
			);
		}
		return null;
	}
}

export default Form.create({
	onValuesChange: (props, changedValues, allValues) => {
		const { onChange, selectedItem } = props;
		onChange(selectedItem, changedValues, { workarea: allValues });
	},
})(MapProperties);
