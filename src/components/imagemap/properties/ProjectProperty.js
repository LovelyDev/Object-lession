import React from 'react';
import { Form, Input, Select, Radio, Row, Col, InputNumber } from 'antd';
import i18n from 'i18next';

import { CommonButton } from '../../common';
import './ProjectProperty.css';



export default {
	render(form, data, onEditCoverImgClick) {
		const { getFieldDecorator } = form;
		if (!data) {
			return null;
		}
		const layout = data.layout || 'fixed';
		return (
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
                                initialValue: data.width,
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
                                initialValue: data.height,
                            })(<InputNumber />)}
                        </Form.Item>
                    </Col>
                </Row>
                <div className="project-cover-image-panel">
                    <Row>
                        <span>Cover Image</span>
                    </Row>
                    <Row className="project-cover-image-panel-body">
                        <div className="project-cover-image">
                            <img src={data.coverImage}/>
                        </div>
                        <CommonButton
                            className="rde-action-btn"
                            shape="circle"
                            icon="edit"
                            tooltipTitle={i18n.t('Edit')}
                            style={{fontSize: 35, height: "auto", marginLeft: 10}}
                            onClick={onEditCoverImgClick}
                        />
                    </Row>
                </div>
                
			</React.Fragment>
		);
	},
};
