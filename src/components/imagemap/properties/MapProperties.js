import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Card } from 'antd';
import axios from 'axios';
import {FileLibraryListItem, ReactMediaLibrary, FileMeta} from 'react-media-library';
import PropertyDefinition from './PropertyDefinition';
import Scrollbar from '../../common/Scrollbar';
import { API_URL } from '../../../config/env';
import axiosInstance from '../../../config/axios';
const { getData, postData, putData, deleteData } = axiosInstance;

class MapProperties extends Component {
    static propTypes = {
		canvasRef: PropTypes.any,
    };
    constructor(props) {
        super(props);
    }
    state = {
        rmlDisplay: false,
        fileLibraryList: [],
    };
	componentDidMount() {
        this.getAllImages();
    }
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
    getAllImages = () => {
        getData('/images')
        .then(res => {
            let mediaList = [];
            res.data.forEach(img => {
                const { image_file } = img;
                if (!image_file) return;
                const { id, caption, size, name, mime, created_at, url } = image_file;
                const newFile = {
                    "_id": id,
                    "title": caption,
                    "size": size,
                    "fileName": name,
                    "type": mime,
                    "createdAt": new Date(created_at),
                    "thumbnailUrl": url.replace("https", "http").replace("s3.us-west-2.amazonaws.com/", "")
                }
                mediaList.push(newFile);
            })
            this.setState({fileLibraryList: mediaList})
            this.forceUpdate();
        })
    }
    uploadCallback = async (fileBase64, fileMeta) => {
        /* convert fileBase64 to File object */
        var arr = fileBase64.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), 
            n = bstr.length, 
            u8arr = new Uint8Array(n);
            
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        const file = new File([u8arr], fileMeta.fileName, {type:mime});
        /* ---------------------------------------------- */
        let formData = new FormData();
        formData.append('files.image_file', file, fileMeta.fileName);
        formData.append('data', JSON.stringify({}));
        const token = localStorage.getItem('Token');
        const res = await axios({
            method: 'post',
            url: `${API_URL}/images`,
            data: formData,
            headers: {'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${token}` }
        });
        if (res.statusText === "OK") {
            const { image_file } = res.data;
            if (!image_file) return;
            const { id, caption, size, name, mime, created_at, url } = image_file;
            const newFile = {
                "_id": id,
                "title": caption,
                "size": size,
                "fileName": name,
                "type": mime,
                "createdAt": new Date(created_at),
                "thumbnailUrl": url.replace("https", "http").replace("s3.us-west-2.amazonaws.com/", "")
            };
            const { fileLibraryList } = this.state;
            this.setState({fileLibraryList: [...fileLibraryList, newFile]});
            this.forceUpdate();
            return true;
        }
        return false;
    }
    deleteCallback = async (item) => {
    }
    selectCallback = (item) => {
        const { onChange } = this.props;
        this.setState({rmlDisplay: false});
        onChange(null, {'src': item.thumbnailUrl}, {workarea: {'src': item.thumbnailUrl}})
        console.log("card background selected", item.thumbnailUrl);
        this.forceUpdate();
    }
    onEditBackgroundImgClick = () => {
        this.setState({ rmlDisplay: true });
        this.forceUpdate();
    }
	render() {
        const { canvasRef, form, animations } = this.props;
        const { rmlDisplay, fileLibraryList } = this.state;
        const showArrow = false;
		if (canvasRef) {
			return (
                <>
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
                                            animations,
                                            this.onEditBackgroundImgClick
                                        )}
                                    </Card>
                                </div>
                            );
                        })}
					</Form>
				</Scrollbar>
                <ReactMediaLibrary
                    show={rmlDisplay}
                    onHide={() => {
                        this.setState({rmlDisplay: false});
                        this.forceUpdate();
                    }}
                    fileUploadCallback={this.uploadCallback}
                    fileLibraryList={fileLibraryList}
                    fileSelectCallback={this.selectCallback}
                    fileDeleteCallback={this.deleteCallback}
                />
                </>
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
