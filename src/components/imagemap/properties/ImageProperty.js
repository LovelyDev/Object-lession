import React from 'react';
import { Row } from 'antd';
import i18n from 'i18next';
import CommonButton from '../../common/CommonButton';
import './ImageProperty.css'

export default {
	render(canvasRef, form, data, animations, onEditBackgroundImgClick) {
		if (!data) {
			return null;
		}
		return (
			<React.Fragment>
				<div className="background-image-panel">
                    <Row className="background-image-panel-body">
                        <div className="background-image">
                            <img src={data.src}/>
                        </div>
                        <CommonButton
                            className="rde-action-btn"
                            shape="circle"
                            icon="edit"
                            tooltipTitle={i18n.t('Edit')}
                            style={{fontSize: 35, height: "auto", marginLeft: 10}}
                            onClick={onEditBackgroundImgClick}
                        />
                    </Row>
                </div>
			</React.Fragment>
		);
	},
};
