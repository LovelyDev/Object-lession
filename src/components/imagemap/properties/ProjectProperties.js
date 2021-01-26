import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Card } from 'antd';

import PropertyDefinition from './PropertyDefinition';
import Scrollbar from '../../common/Scrollbar';

class ProjectProperties extends Component {
	static propTypes = {
		canvasRef: PropTypes.any,
	};

	render() {
		const { canvasRef, form } = this.props;
		const showArrow = true;
		if (canvasRef) {
			return (
				<Scrollbar>
					<Form layout="horizontal">
                        {Object.keys(PropertyDefinition.project).map(key => {
                            return (
                                <div key={key} className="site-card-border-less-wrapper">
                                    <Card key={key} title={PropertyDefinition.project[key].title}>
                                        {PropertyDefinition.project[key].component.render(
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
})(ProjectProperties);
