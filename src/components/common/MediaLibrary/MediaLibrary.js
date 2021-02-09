import React, { Component } from 'react';
import RUG, { DragArea, DropArea, Card } from 'react-upload-gallery';
import { Modal, Button } from 'antd';
import axios from 'axios';
import { API_URL } from '../../../config/env';
import axiosInstance from '../../../config/axios';
import 'react-upload-gallery/dist/style.css';
import './MediaLibrary.css';
const { getData, postData, putData, deleteData } = axiosInstance;
const { confirm } = Modal;

class MediaLibrary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fileLibraryList: [],
            selectedImages: []
        };
    }
    componentDidMount() {
        this.getAllImages();
    }
    getAllImages = () => {
        const { projectId } = this.props;
        getData(`/images?project=${projectId}`)
        .then(res => {
            let mediaList = [];
            res.data.forEach(img => {
                const { image_file } = img;
                if (!image_file) return;
                const { name, url } = image_file;
                const newFile = {
                    source: url.replace("https", "http").replace("s3.us-west-2.amazonaws.com/", ""),
                    name,
                    id: img.id
                }
                mediaList.push(newFile);
            })
            this.setState({fileLibraryList: [...mediaList], selectedImages: []})
            this.forceUpdate();
        })
    }
    customRequest = ({ uid, file, send, action, headers, onProgress, onSuccess, onError }) => {
        const { projectId } = this.props;

        const form = new FormData();
        // send file 
        form.append('files.image_file', file);
        form.append('data', JSON.stringify({
            project: projectId
        }));

        const CancelToken = axios.CancelToken
        const source = CancelToken.source()       
        const token = localStorage.getItem('Token');
        axios.post(
            action,
            form,
            {
                headers: {'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${token}` },
                onUploadProgress: ({ total, loaded }) => {
                    onProgress(uid, Math.round(loaded / total * 100));
                },
                cancelToken: source.token
            }
        ).then(({ data: response }) => {
            onSuccess(uid, response);
        })
        .catch(error => {
            onError(uid, {
                action,
                status: error.request,
                response: error.response
            })
        })
        
        return {
            abort() {
                source.cancel()
            }
        }
    }
    onImageCardSelect = (image) => {
        const { selectedImages } = this.state;
        if(typeof image.isSelected === 'undefined' || !image.isSelected) {
            this.setState({ selectedImages: [...selectedImages, image] });
            image.isSelected = true;
        } else {
            const newImages = selectedImages.filter(img => img.uid !== image.uid)
            this.setState({ selectedImages: [...newImages] });
            image.isSelected = false;
        }
        this.forceUpdate();
    }
    clearSelectedImages = () => {
        const { selectedImages } = this.state;
        selectedImages.forEach(img => img.isSelected = false);
        this.setState({ selectedImages: [] });
    }
    onConfirmDelete = (curImg, imgs) => {
        console.log("onconfirmdelete", curImg);
        return new Promise(resolve => {
            confirm({
                content: <span>Are you sure?</span>,
                onOk: () => {
                    if (curImg.isSelected) {
                        this.onImageCardSelect(curImg);
                    }
                    deleteData(`/images/${curImg.id}`)
                    .then(res => resolve(true))
                    .catch(err => resolve(false))
                },
                onCancel: () => {
                  resolve(false);
                },
            });
        })
    }
    isChild = (element, classname) => {
        if (typeof element.className !== 'object' && // SVGs are weird, man.
            element.className.split(' ').indexOf(classname) >= 0) {
            return true;
        } else if (element.tagName !== 'HTML') { // If you've reached the body, you've gone too far
            return element.parentNode && this.isChild(element.parentNode, classname);
        } else {
            return false;
        }
    }
    onCancel = () => {
        const { onClose } = this.props;
        this.clearSelectedImages();
        onClose();
    }
    onSelect = () => {
        const { onSelect } = this.props;
        const { selectedImages } = this.state;
        onSelect(selectedImages);
        this.clearSelectedImages();
    }
    render() {
        const { visible } = this.props;
        const { fileLibraryList } = this.state;
        return (
            <Modal
                title="Media Library"
                visible={visible}
                onOk={this.onSelect}
                onCancel={this.onCancel}
                width="80vw"
                footer={[
                    <Button key="select" type="primary" onClick={this.onSelect}>
                        Select
                    </Button>
                ]}
            >
                <RUG
                    action={`${API_URL}/images`}
                    source={response => {
                        const url = response?.image_file?.url;
                        if (url) {
                            return url.replace("https", "http").replace("s3.us-west-2.amazonaws.com/", "")
                        }
                    }}
                    customRequest={this.customRequest}
                    initialState={fileLibraryList}
                    onConfirmDelete={this.onConfirmDelete}
                >
                    <DropArea>
                    {
                        (isDrag) => (
                            <DragArea className="rug-dragarea">
                            {
                                (image) => {
                                    const { isSelected } = image;
                                    return (
                                        <div className="rug-item">
                                            <div
                                                style={{display: "inline-flex"}}
                                                className={isSelected ? "red-border" : null}
                                            >
                                                <Card
                                                    style={{display: "inline-table"}}
                                                    image={image}
                                                    onClick={(e) => {
                                                        if (this.isChild(e.target, "rug-card-remove")) {
                                                            return ;
                                                        }
                                                        this.onImageCardSelect(image);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    );
                                }
                            }
                            </DragArea>
                        )
                    }
                    </DropArea>
                </RUG>
            </Modal>
        )
    }
}

export default MediaLibrary;
