import React, { Component } from 'react';
import i18n from 'i18next';
import { v4 } from 'uuid';
import { CommonButton } from '../../common';
import Scrollbar from '../../common/Scrollbar';
import './PageListPanel.css'

class Page extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { id, active, onPageClick, onDeleteClick, getPanelState } = this.props;
        const { pages } = getPanelState();
        return <div className="panel-list-item">
            <div
                className={`panel-list-item-page ${active ? "border-green" : "border-black"}`}
                onClick={() => onPageClick(id)}
            >
                {id}
            </div>
            {
                (pages.length !== 1) &&
                <CommonButton
                    className="rde-action-btn"
                    shape="circle"
                    icon="trash"
                    tooltipTitle={i18n.t('action.delete')}
                    onClick={() => onDeleteClick(id)}
                />
            }
        </div>
    }
}

class PageListPanel extends Component {
    constructor(props) {
        super(props);
        const { onPanelStateChange } = this.props;
        const id = v4();
        this.state = {
            pages: [{id}],
            curPageId: id
        }
        onPanelStateChange('init', id);
    }
    onPageClick = (id) => {
        const { onPanelStateChange } = this.props;
        this.setState({curPageId: id});
        onPanelStateChange('page-change', id);
    }
    onDeleteClick = (id) => {
        const { onPanelStateChange } = this.props;
        const { pages, curPageId } = this.state;
        let value = curPageId;
        this.setState({pages: pages.filter((page, i) => {
            if (page.id !== id) return true;
            if (id === curPageId) {
                if (i === (pages.length - 1)) {
                    this.setState({curPageId: pages[i - 1].id});
                    value = pages[i - 1].id;
                } else {
                    this.setState({curPageId: pages[i + 1].id});
                    value = pages[i + 1].id;
                }
            }
            return false;
        })});
        onPanelStateChange('delete', value);
    }
    onAddClick = () => {
        const { onPanelStateChange } = this.props;
        const id = v4();
        const { pages } = this.state;
        this.setState({ pages: [...pages, {id}] });
        onPanelStateChange('add', id);
    }
    getPanelState = () => this.state;
    render() {
        const { pages, curPageId } = this.state;
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
                        <div>
                            {
                                pages.map(page =>
                                    <Page
                                        id={page.id}
                                        active={ page.id === curPageId }
                                        onPageClick={this.onPageClick}
                                        onDeleteClick={this.onDeleteClick}
                                        getPanelState={this.getPanelState}
                                    />)
                            }
                        </div>
                    </div>
                </Scrollbar>
            </div>
    }
    
}

export default PageListPanel;
