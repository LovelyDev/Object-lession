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
import FileCard from '../FileCard';

class ProjectProperties extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rmlDisplay: false,
            fileLibraryList: [],
        }
    }
    componentDidMount() {
        this.getAllImages();
    }
    getAllImages = () => {
        getData(`/images?project=${this.props.projectId}`)
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
        formData.append('data', JSON.stringify({
            project: this.props.projectId
        }));
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
        onChange(null, {'cover-image': item.thumbnailUrl}, {project: {'cover-image': item.thumbnailUrl}})
        console.log("cover-image selected", item.thumbnailUrl);
        this.forceUpdate();
    }
    onEditCoverImgClick = () => {
        this.setState({ rmlDisplay: true });
        this.forceUpdate();
    }
	render() {
        const { projectConf, form } = this.props;
        const { fileLibraryList, rmlDisplay } = this.state;
		const showArrow = true;
        return <>
                <Scrollbar>
                    <Form layout="horizontal">
                        {Object.keys(PropertyDefinition.project).map(key => {
                            return (
                                <div key={key} className="site-card-border-less-wrapper">
                                    <Card key={key} title={PropertyDefinition.project[key].title}>
                                        {PropertyDefinition.project[key].component.render(
                                            form,
                                            projectConf,
                                            this.onEditCoverImgClick
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
                    libraryCardComponent={FileCard}
                    fileUploadCallback={this.uploadCallback}
                    fileLibraryList={fileLibraryList}
                    fileSelectCallback={this.selectCallback}
                    fileDeleteCallback={this.deleteCallback}
                />
            </>
	}
}

export default Form.create({
	onValuesChange: (props, changedValues, allValues) => {
		const { onChange, selectedItem } = props;
		onChange(selectedItem, changedValues, { project: allValues });
	},
})(ProjectProperties);
