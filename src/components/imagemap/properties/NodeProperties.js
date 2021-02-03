import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Collapse, List, Input, Checkbox, InputNumber, Row, Col } from 'antd';
import i18n from 'i18next';

import PropertyDefinition from './PropertyDefinition';
import Scrollbar from '../../common/Scrollbar';
import { Flex } from '../../flex';
import './NodeProperties.css'

const { Panel } = Collapse;

class NodeProperties extends Component {
    constructor(props) {
        super(props);
    }
	static propTypes = {
		canvasRef: PropTypes.any,
		selectedItem: PropTypes.object,
	};

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (this.props.selectedItem && nextProps.selectedItem) {
			if (this.props.selectedItem.id !== nextProps.selectedItem.id) {
				nextProps.form.resetFields();
			}
		}
    }
	// render() {
	// 	const { canvasRef, selectedItem, form } = this.props;
    //     const showArrow = false;
	// 	return (
	// 		<Scrollbar>
	// 			<Form layout="horizontal" colon={false}>
	// 				<Collapse bordered={false}>
	// 					{selectedItem && PropertyDefinition[selectedItem.type] ? (
	// 						Object.keys(PropertyDefinition[selectedItem.type]).map(key => {
	// 							return (
	// 								<Panel
	// 									key={key}
	// 									header={PropertyDefinition[selectedItem.type][key].title}
	// 									showArrow={showArrow}
	// 								>
	// 									{PropertyDefinition[selectedItem.type][key].component.render(
	// 										canvasRef,
	// 										form,
	// 										selectedItem,
	// 									)}
	// 								</Panel>
	// 							);
	// 						})
	// 					) : (
	// 						<Flex
	// 							justifyContent="center"
	// 							alignItems="center"
	// 							style={{
	// 								width: '100%',
	// 								height: '100%',
	// 								color: 'rgba(0, 0, 0, 0.45)',
	// 								fontSie: 16,
	// 								padding: 16,
	// 							}}
	// 						>
	// 							<List />
	// 						</Flex>
	// 					)}
	// 				</Collapse>
	// 			</Form>
	// 		</Scrollbar>
	// 	);
    // }
    render() {
        const { canvasRef, form } = this.props;
        let { selectedItem } = this.props;
        const showArrow = false;
        const  { getFieldDecorator } = form;
        let data, workarea;
        if (selectedItem && canvasRef) {
            data = selectedItem;
            workarea = canvasRef.handler.workarea;
            if (Array.isArray(selectedItem)) {
                selectedItem.forEach(item => {
                    item['posX'] = parseInt(item.left - workarea.left);
                    item['posY'] = parseInt(item.top - workarea.top);
                })
            } else {
                selectedItem['posX'] = parseInt(selectedItem.left - workarea.left);
                selectedItem['posY'] = parseInt(selectedItem.top - workarea.top);
            }
        }
        
		return (
			<Scrollbar>
				<Form layout="horizontal" colon={false}>
                {data && workarea ? (<div className="object-attribute">
                    <Row className="object-attribute-row">
                        <Col span={12}>
                            <span>Name:</span>
                        </Col>
                        <Col span={12}>
                            <Form.Item colon={false}>
                                {getFieldDecorator('object_name', {
                                    initialValue: data.object_name,
                                })(<Input
                                    placeholder="Name"
                                    style={{width: 150}}
                                />)}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row className="object-attribute-row">
                        <Col span={12}>
                            <span>Dragabble:</span>
                        </Col>
                        <Col span={12}>
                            <Form.Item colon={false}>
                                {getFieldDecorator('dragabble', {
                                    valuePropName: 'checked',
                                    initialValue: data.dragabble,
                                })(<Checkbox
                                    name="dragabble"
                                >
                                </Checkbox>)}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row className="object-attribute-row">
                        <Col span={12}>
                            <span>Clone on drag:</span>
                        </Col>
                        <Col span={12}>
                            <Form.Item colon={false}>
                                {getFieldDecorator('clone_on_drag', {
                                    valuePropName: 'checked',
                                    initialValue: data.clone_on_drag,
                                })(<Checkbox>
                                </Checkbox>)}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row className="object-attribute-row">
                        <Col span={12}>
                            <span>Return on drag:</span>
                        </Col>
                        <Col span={12}>
                            <Form.Item colon={false}>
                                {getFieldDecorator('return_on_drag', {
                                    valuePropName: 'checked',
                                    initialValue: data.return_on_drag,
                                })(<Checkbox>
                                </Checkbox>)}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item label={i18n.t('common.left')} colon={false}>
                                {getFieldDecorator('left', {
                                    rules: [
                                        {
                                            required: true,
                                            message: 'Please input x position',
                                        },
                                    ],
                                    initialValue: parseInt(data.left - workarea.left),
                                })(<InputNumber disabled={true} />)}
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label={i18n.t('common.top')} colon={false}>
                                {getFieldDecorator('top', {
                                    rules: [
                                        {
                                            required: true,
                                            message: 'Please input y position',
                                        },
                                    ],
                                    initialValue: parseInt(data.top - workarea.top),
                                })(<InputNumber disabled={true} />)}
                            </Form.Item>
                        </Col>
                    </Row>
                    </div>)
                    : (<Flex
                            justifyContent="center"
                            alignItems="center"
                            style={{
                                width: '100%',
                                height: '100%',
                                color: 'rgba(0, 0, 0, 0.45)',
                                fontSie: 16,
                                padding: 16,
                            }}
                        >
                            <List />
                        </Flex>
                    )}
					{/* <Collapse bordered={false}>
						{selectedItem ? (
							<div className="attribute-definition">
                                <div>
                                    <span>Name: </span>
                                    <Input
                                        placeholder="Name"
                                        style={{width: 150}}
                                        name="name"
                                        onChange={this.onAttributeChange('name')}
                                        value={object_name}
                                    />
                                </div>
                                <div>
                                    <span>Dragabble: </span>
                                    <Checkbox
                                        name="dragabble"
                                        onChange={this.onAttributeChange('check')}
                                        checked={dragabble}
                                    >
                                    </Checkbox>
                                </div>
                                <div>
                                    <span>Clone on Drag: </span>
                                    <Checkbox
                                        name="clone_on_drag"
                                        onChange={this.onAttributeChange('check')}
                                        checked={clone_on_drag}
                                    >
                                    </Checkbox>
                                </div>
                                <div>
                                    <span>Return on Drag: </span>
                                    <Checkbox
                                        name="return_on_drag"
                                        onChange={this.onAttributeChange('check')}
                                        checked={return_on_drag}
                                    >
                                    </Checkbox>
                                </div>
                            </div>
						) : (
							<Flex
								justifyContent="center"
								alignItems="center"
								style={{
									width: '100%',
									height: '100%',
									color: 'rgba(0, 0, 0, 0.45)',
									fontSie: 16,
									padding: 16,
								}}
							>
								<List />
							</Flex>
						)}
					</Collapse> */}
				</Form>
			</Scrollbar>
		);
	}
}

export default Form.create({
	onValuesChange: (props, changedValues, allValues) => {
		const { onChange, selectedItem } = props;
		onChange(selectedItem, changedValues, allValues);
	},
})(NodeProperties);
