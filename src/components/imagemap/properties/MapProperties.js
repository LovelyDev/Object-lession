import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Card } from 'antd';

import PropertyDefinition from './PropertyDefinition';
import Scrollbar from '../../common/Scrollbar';

class MapProperties extends Component {
	static propTypes = {
		canvasRef: PropTypes.any,
	};
    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.canvasRef !== nextProps.canvasRef) {
            const data = nextProps.canvasRef.handler.workarea;
            this.props.form.setFieldsValue({
                name: data.name,
                'card-type': data['card-type'],
                'correct-answer': data['correct-answer'],
                'drag-destination': data['drag-destination'],
                'correct-animation': data['correct-animation'],
                'wrong-animation': data['wrong-animation']
            })
        }
        return true;
    }
	render() {
		const { canvasRef, form, animations } = this.props;
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
                                            animations
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
