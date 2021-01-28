import React, { Component } from 'react';
import { Button, List, Avatar, Select, Row, Col, Input } from 'antd';
const { Option } = Select;
import { Flex } from '../../flex';
import Icon from '../../icon/Icon';
import './AnimationStepList.css'

class AnimationStepList extends Component {
    constructor(props) {
        super(props);
    }
    onObjectChange = (index) => (value) => {
        const { onObjectChange } = this.props;
        const { objects } = this.props;
        let obj = null;
        for (let i = 0; i < objects.length; i++) {
            const e = objects[i];
            if (e.object_name === value) {
                obj = e;
                break;
            }
        }
        onObjectChange(index, obj);
    }

    onDObjectChange = (index) => (value) => {
        const { onDObjectChange } = this.props;
        const { objects } = this.props;
        let obj = null;
        for (let i = 0; i < objects.length; i++) {
            const e = objects[i];
            if (e.object_name === value) {
                obj = e;
                break;
            }
        }
        onDObjectChange(index, obj);
    }
    
    onTypeChange = (index) => (value) => {
        const { onTypeChange } = this.props;
        onTypeChange(index, value);
    }

    onDurationChange = (index, value) => {
        const { onDurationChange } = this.props;
        onDurationChange(index, value);
    }
    onDPositionChange = (axis, index, value) => {
        const { onDPositionChange } = this.props;
        onDPositionChange(axis, index, value);
    }
    onBlur = () => {
    }
    
    onFocus = () => {
    }
    
    onSearch = (val) => {
    }
	render() {
        const { animationSteps, objects } = this.props;
        const { onAdd, onClear, onDelete } = this.props;
		return (
                <Flex flexDirection="column">
                    <Flex justifyContent="flex-end" style={{ padding: 8 }}>
                        <Button className="rde-action-btn" shape="circle" onClick={onAdd}>
                            <Icon name="plus" />
                        </Button>
                        <Button className="rde-action-btn" shape="circle" onClick={onClear}>
                            <Icon name="times" />
                        </Button>
                    </Flex>
                    <List
                        dataSource={animationSteps}
                        renderItem={(animationStep, index) => {
                            const actions = [
                                <Button
                                    className="rde-action-btn"
                                    shape="circle"
                                    onClick={() => {
                                        onDelete(index);
                                    }}
                                >
                                    <Icon name="times" />
                                </Button>
                            ];
                            const description = (
                                <div className="animation-step-form">
                                    <Row>
                                        <Col span={8}>
                                            <span>Object:</span>
                                        </Col>
                                        <Col span={16}>
                                            <Select
                                                showSearch
                                                style={{ width: 200 }}
                                                placeholder="Select Object"
                                                optionFilterProp="children"
                                                onChange={this.onObjectChange(index)}
                                                onFocus={this.onFocus}
                                                onBlur={this.onBlur}
                                                onSearch={this.onSearch}
                                                value={animationStep.object ? animationStep.object.object_name : null}
                                                filterOption={(input, option) => 
                                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                }
                                            >
                                                {objects ? objects.map(obj => <Option value={obj.object_name}>{obj.object_name}</Option>) : null}
                                            </Select>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={8}>
                                            <span>Type:</span>
                                        </Col>
                                        <Col span={16}>
                                            <Select
                                                showSearch
                                                style={{ width: 200 }}
                                                placeholder="Select Type"
                                                optionFilterProp="children"
                                                onChange={this.onTypeChange(index)}
                                                onFocus={this.onFocus}
                                                onBlur={this.onBlur}
                                                onSearch={this.onSearch}
                                                value={animationStep.type}
                                                filterOption={(input, option) =>
                                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                }
                                            >
                                                <Option value="hide">HIDE</Option>
                                                <Option value="show">SHOW</Option>
                                                <Option value="move">MOVE</Option>
                                                <Option value="move-to">MOVE TO</Option>
                                            </Select>
                                        </Col>
                                    </Row>
                                    {animationStep.type === 'move' && <Row>
                                        <Col span={8}>
                                            <span>Destination Position (x, y):</span>
                                        </Col>
                                        <Col span={4}>
                                            <Input placeholder="x" style={{width: 50}} value={animationStep.d_xposition} onChange={(e) => {
                                                const patt1 = /\D/g;
                                                const result = e.target.value.match(patt1);
                                                if (!result || result.length === 0) {
                                                    this.onDPositionChange('x', index, e.target.value);
                                                }
                                            }} />
                                        </Col>
                                        <Col span={12}>
                                            <Input placeholder="y" style={{width: 50}} value={animationStep.d_yposition} onChange={(e) => {
                                                const patt1 = /\D/g;
                                                const result = e.target.value.match(patt1);
                                                if (!result || result.length === 0) {
                                                    this.onDPositionChange('y', index, e.target.value);
                                                }
                                            }} />
                                        </Col>
                                    </Row>
                                    }
                                    {animationStep.type === 'move-to' && <Row>
                                        <Col span={8}>
                                            <span>Destination Object:</span>
                                        </Col>
                                        <Col span={16}>
                                            <Select
                                                showSearch
                                                style={{ width: 200 }}
                                                placeholder="Select Object"
                                                optionFilterProp="children"
                                                onChange={this.onDObjectChange(index)}
                                                value={animationStep.d_object ? animationStep.d_object.object_name : null}
                                                filterOption={(input, option) => 
                                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                }
                                            >
                                                {objects ? objects.map(obj => <Option value={obj.object_name}>{obj.object_name}</Option>) : null}
                                            </Select>
                                        </Col>
                                    </Row>
                                    }
                                    <Row>
                                        <Col span={8}>
                                            <span>Duration:</span>
                                        </Col>
                                        <Col span={16}>
                                            <Input style={{width: 50}} value={animationStep.duration} onChange={(e) => {
                                                const patt1 = /\D/g;
                                                const result = e.target.value.match(patt1);
                                                if (!result || result.length === 0) {
                                                    this.onDurationChange(index, e.target.value);
                                                }
                                                
                                            }} />
                                            <span>seconds</span>
                                        </Col>
                                    </Row>
                                </div>
                            );
                            return (
                                <List.Item actions={actions}>
                                    <List.Item.Meta
                                        avatar={<Avatar>{index + 1}</Avatar>}
                                        description={description}
                                    />
                                </List.Item>
                            );
                        }}
                    />
                </Flex>
		);
	}
}

export default AnimationStepList;
