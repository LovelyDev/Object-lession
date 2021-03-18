import React, { Component } from 'react';
import i18n from 'i18next';
import { v4 } from 'uuid';
import Reorder, {
    reorder,
    reorderImmutable,
    reorderFromTo,
    reorderFromToImmutable
} from 'react-reorder';
import { CommonButton } from '../../common';
import Scrollbar from '../../common/Scrollbar';
import './PageListPanel.css'

class Page extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { id, active, onPageClick, onDeleteClick, pageCount, getPreviewImgById, onDuplicateClick, index, preview } = this.props;
        //const img = getPreviewImgById(id);
        return <div className="panel-list-item">
            <span className="panel-list-item-card-number">{index}</span>
            <div
                className={`panel-list-item-page ${active ? "border-green" : "border-black"}`}
                onClick={() => onPageClick(id)}
            >
                <img className="panel-list-item-page-preview" src={preview} alt=""/>
                 {/* {id} */}
            </div>
            <div className="panel-list-item-btn-group">
                {(pageCount !== 1) &&
                    <CommonButton
                        className="rde-action-btn"
                        shape="circle"
                        icon="trash"
                        tooltipTitle={i18n.t('action.delete')}
                        onClick={() => onDeleteClick(id)}
                    />
                }
                {active &&
                    <CommonButton
                        className="rde-action-btn"
                        shape="circle"
                        icon="clone"
                        tooltipTitle={i18n.t('Duplicate')}
                        onClick={() => onDuplicateClick(id)}
                    />
                }
            </div>
            
        </div>
    }
}

class Template extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { active, preview } = this.props;
        const { onPageClick } = this.props;
        return <div className="panel-list-item">
            <div
                className={`panel-list-item-page ${active ? "border-green" : "border-black"} template-item`}
                onClick={() => onPageClick('template')}
            >
                <img className="panel-list-item-page-preview" src={preview} alt=""/>
            </div>
        </div>
    }
}

class PageListPanel extends Component {
    constructor(props) {
        super(props);
        const { onPanelStateChange } = this.props;
        onPanelStateChange('init');
    }
    onPageClick = (id) => {
        const { onPanelStateChange } = this.props;
        onPanelStateChange('page-change', id);
    }
    onDeleteClick = (id) => {
        const { onPanelStateChange } = this.props;
        onPanelStateChange('delete', id);
    }
    onAddClick = () => {
        const { onPanelStateChange } = this.props;
        onPanelStateChange('add');
    }
    onDuplicateClick = (id) => {
        const { onPanelStateChange } = this.props;
        onPanelStateChange('duplicate', id);
    }
    // render() {
    //     const { pages, curPageId } = this.props;
    //     const { getPreviewImgById } = this.props;
    //     return <div className="rde-editor-items panel-list">
    //             <Scrollbar>
    //                 <div>
    //                     <div className="panel-header">
    //                         <CommonButton
    //                             className="rde-action-btn"
    //                             shape="circle"
    //                             icon="plus"
    //                             tooltipTitle={i18n.t('action.add')}
    //                             onClick={this.onAddClick}
    //                         />
    //                     </div>
    //                     <div>
    //                         {
    //                             pages.map((page,index) =>
    //                                 <Page
    //                                     index={index}
    //                                     id={page.id}
    //                                     key={page.id}
    //                                     active={ page.id === curPageId }
    //                                     onPageClick={this.onPageClick}
    //                                     onDeleteClick={this.onDeleteClick}
    //                                     pageCount={pages.length}
    //                                     getPreviewImgById={getPreviewImgById}
    //                                     onDuplicateClick={this.onDuplicateClick}
    //                                 />)
    //                         }
    //                     </div>
    //                 </div>
    //             </Scrollbar>
    //         </div>
    // }
    storeRef = ref => {

    }
    onReorder = (event, previousIndex, nextIndex, fromId, toId) => {
        const { onReorder } = this.props;
        onReorder(previousIndex + 1, nextIndex + 1);
    }
    render() {
        const { pages, curPageId } = this.props;
        const { getPreviewImgById } = this.props;
        return <div className="rde-editor-items panel-list">
            <Scrollbar>
                <div>
                    <div className="panel-header">
                        <CommonButton
                            className="rde-action-btn"
                            shape="circle"
                            icon="plus"
                            tooltipTitle={i18n.t('action.add')}
                            onClick={this.onAddClick}
                        />
                    </div>
                    <div className="panel-template">
                        <Template
                            active={ curPageId === 'template' }
                            onPageClick={this.onPageClick}
                            preview={ pages[0].preview }
                        />
                    </div>
                    <hr className="horizontal-line" />
                    <div>
                        <Reorder
                            reorderId="my-list" // Unique ID that is used internally to track this list (required)
                            reorderGroup="reorder-group" // A group ID that allows items to be dragged between lists of the same group (optional)
                            getRef={this.storeRef} // Function that is passed a reference to the root node when mounted (optional)
                            component="ul" // Tag name or Component to be used for the wrapping element (optional), defaults to 'div'
                            placeholderClassName="placeholder" // Class name to be applied to placeholder elements (optional), defaults to 'placeholder'
                            draggedClassName="dragged" // Class name to be applied to dragged elements (optional), defaults to 'dragged'
                            lock="horizontal" // Lock the dragging direction (optional): vertical, horizontal (do not use with groups)
                            holdTime={500} // Default hold time before dragging begins (mouse & touch) (optional), defaults to 0
                            touchHoldTime={500} // Hold time before dragging begins on touch devices (optional), defaults to holdTime
                            mouseHoldTime={200} // Hold time before dragging begins with mouse (optional), defaults to holdTime
                            onReorder={this.onReorder} // Callback when an item is dropped (you will need this to update your state)
                            autoScroll={true} // Enable auto-scrolling when the pointer is close to the edge of the Reorder component (optional), defaults to true
                            disabled={false} // Disable reordering (optional), defaults to false
                            disableContextMenus={true} // Disable context menus when holding on touch devices (optional), defaults to true
                        >
                            {
                                pages.slice(1, pages.length).map((page,index) => {
                                    return <li key={page.id}>
                                        <Page
                                            index={index + 1}
                                            id={page.id}
                                            key={page.id}
                                            active={ page.id === curPageId }
                                            onPageClick={this.onPageClick}
                                            onDeleteClick={this.onDeleteClick}
                                            pageCount={pages.length}
                                            getPreviewImgById={getPreviewImgById}
                                            onDuplicateClick={this.onDuplicateClick}
                                            preview={page.preview}
                                        />
                                    </li>
                                })
                            }
                        </Reorder>
                    </div>
                </div>
            </Scrollbar>
        </div>
    }
}

export default PageListPanel;
