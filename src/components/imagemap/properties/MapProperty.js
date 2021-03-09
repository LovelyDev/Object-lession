import React from 'react';
import { Form, Input, Select, Radio, Row, Col, InputNumber } from 'antd';
import i18n from 'i18next';
import './MapProperty.css';
const { Option } = Select;

export default {
	render(canvasRef, form, data, animations) {
		const { getFieldDecorator, getFieldValue } = form;
		if (!data) {
			return null;
		}
        const layout = data.layout || 'fixed';
        const cardType = getFieldValue('card-type');
        let objects = [];
        if (canvasRef) {
            objects = canvasRef.handler.exportJSON().filter(obj => {
                if (!obj) return false;
                if (typeof obj.object_name === 'undefined' || !obj.object_name || obj.object_name === '')
                    return false;
                return true;
            })
        }
        console.log("animations", data['correct-animation'], data['wrong-animation']);
        let cAnime = "", wAnime = "";
        try {
            cAnime = JSON.parse(data['correct-animation']).name;
            wAnime = JSON.parse(data['wrong-animation']).name;
        } catch (err) {

        }
		return (
			<React.Fragment>
                <Row className="card-attribute-row">
                    <Col span={9}>
                        <span>Name</span>
                    </Col>
                    <Col span={15}>
                        <Form.Item colon={false}>
                            {getFieldDecorator('name', {
                                rules: [
                                    {
                                        required: false,
                                        message: i18n.t('validation.enter-arg', { arg: i18n.t('common.name') }),
                                    },
                                ],
                                initialValue: data.name || '',
                            })(<Input />)}
                        </Form.Item>
                    </Col>
                </Row>
                <Row className="card-attribute-row">
                    <Col span={9}>
                        <span>Card Type</span>
                    </Col>
                    <Col span={15}>
                        <Form.Item colon={false}>
                            {getFieldDecorator('card-type', {
                                initialValue: data['card-type'] || null,
                            })(<Select
                                placeholder="Card Type"
                            >
                                <Option value="select-answer">Select answer</Option>
                                <Option value="enter-answer">Enter answer</Option>
                                <Option value="drag-answer">Drag answer</Option>
                                <Option value="drag-sum">Drag sum</Option>
                            </Select>)}
                        </Form.Item>
                    </Col>
                </Row>
                {data['card-type'] === 'drag-sum' &&
                    <Row className="card-attribute-row">
                        <Col span={9}>
                            <span>Answer Quantity</span>
                        </Col>
                        <Col span={15}>
                            <Form.Item colon={false}>
                                {getFieldDecorator('answer-quantity', {
                                    initialValue: data['answer-quantity'] || null,
                                })(<Input />)}
                            </Form.Item>
                        </Col>
                    </Row>
                }
                {data['card-type'] === 'enter-answer' && 
                    <>
                    <Row className="card-attribute-row">
                        <Col span={9}>
                            <span>Correct Answer</span>
                        </Col>
                        <Col span={15}>
                            <Form.Item colon={false}>
                                {getFieldDecorator('answer', {
                                    initialValue: data['answer'] || null,
                                })(<Input />)}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row className="card-attribute-row">
                        <Col span={9}>
                            <span>Answer Field</span>
                        </Col>
                        <Col span={15}>
                            <Form.Item colon={false}>
                                {getFieldDecorator('answer-field', {
                                    initialValue: data['answer-field'] || null,
                                })(<Select
                                    showSearch
                                    placeholder="Select TextField"
                                    optionFilterProp="children"
                                    filterOption={(input, option) => 
                                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {objects ? objects.filter( obj => obj.type=='textbox').map(obj => <Option value={obj.object_name}>{obj.object_name}</Option>) : null}
                                </Select>)}
                            </Form.Item>
                        </Col>
                    </Row>
                    </>
                }
                {data['card-type'] !== 'enter-answer' &&
                <Row className="card-attribute-row">
                    <Col span={9}>
                        {data['card-type'] === 'select-answer' ?
                        <span>Correct Answer</span>
                        : data['card-type'] && <span>Drag Destination</span>
                        }
                    </Col>
                    <Col span={15}>
                        {data['card-type'] === 'select-answer' ?
                            <Form.Item colon={false}>
                                {getFieldDecorator('correct-answer', {
                                    initialValue: data['correct-answer'] || null,
                                })(<Select
                                    showSearch
                                    placeholder="Select Object"
                                    optionFilterProp="children"
                                    filterOption={(input, option) => 
                                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {objects ? objects.map(obj => <Option value={obj.object_name}>{obj.object_name}</Option>) : null}
                                </Select>)}
                            </Form.Item>
                            : data['card-type'] && <Form.Item colon={false}>
                                {getFieldDecorator('drag-destination', {
                                    initialValue: data['drag-destination'] || null,
                                })(<Select
                                    showSearch
                                    placeholder="Select Object"
                                    optionFilterProp="children"
                                    filterOption={(input, option) => 
                                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {objects ? objects.map(obj => <Option value={obj.object_name}>{obj.object_name}</Option>) : null}
                                </Select>)}
                            </Form.Item>
                        }
                    </Col>
                </Row>
                }
                <Row className="card-attribute-row">
                    <Col span={9}>
                        <span>Correct Animation</span>
                    </Col>
                    <Col span={15}>
                        <Form.Item colon={false}>
                            {getFieldDecorator('correct-animation', {
                                valuePropName: 'value',
                                initialValue: data['correct-animation'] || null,
                            })(<Select
                                showSearch
                                placeholder="Select Object"
                                optionFilterProp="children"
                                filterOption={(input, option) => 
                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {animations ? animations.map(e => <Option value={JSON.stringify({id: e.id, name: e.name})}>{e.name}</Option>) : null}
                            </Select>)}
                        </Form.Item>
                    </Col>
                </Row>
                <Row className="card-attribute-row">
                    <Col span={9}>
                        <span>Wrong Animation</span>
                    </Col>
                    <Col span={15}>
                        <Form.Item colon={false}>
                            {getFieldDecorator('wrong-animation', {
                                valuePropName: 'value',
                                initialValue: data['wrong-animation'] || null,
                            })(<Select
                                showSearch
                                placeholder="Select Object"
                                optionFilterProp="children"
                                filterOption={(input, option) => 
                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {animations ? animations.map(e => <Option value={JSON.stringify({id: e.id, name: e.name})}>{e.name}</Option>) : null}
                            </Select>)}
                        </Form.Item>
                    </Col>
                </Row>
                
				{/* <Form.Item label={i18n.t('common.layout')} colon={false}>
					{getFieldDecorator('layout', {
						initialValue: layout,
					})(
						<Radio.Group size="small">
							<Radio.Button value="fixed">{i18n.t('common.fixed')}</Radio.Button>
							<Radio.Button value="responsive">{i18n.t('common.responsive')}</Radio.Button>
							<Radio.Button value="fullscreen">{i18n.t('common.fullscreen')}</Radio.Button>
						</Radio.Group>,
					)}
				</Form.Item>
				{layout === 'fixed' ? (
					<React.Fragment>
						<Row>
							<Col span={12}>
								<Form.Item label={i18n.t('common.width')} colon={false}>
									{getFieldDecorator('width', {
										rules: [
											{
												required: true,
												message: i18n.t('validation.enter-arg', {
													arg: i18n.t('common.width'),
												}),
											},
										],
										initialValue: data.width * data.scaleX,
									})(<InputNumber />)}
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item label={i18n.t('common.height')} colon={false}>
									{getFieldDecorator('height', {
										rules: [
											{
												required: true,
												message: i18n.t('validation.enter-arg', {
													arg: i18n.t('common.height'),
												}),
											},
										],
										initialValue: data.height * data.scaleY,
									})(<InputNumber />)}
								</Form.Item>
							</Col>
						</Row>
					</React.Fragment>
				) : null} */}
			</React.Fragment>
		);
	},
};
