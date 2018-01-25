import React, { Component } from 'react';
import { 
  Tag,
  Popover,
  Tooltip
} from 'antd';
import './TrackingTimelineTable.css';
import { PropTypes } from 'mobx-react';
import ReactPropTypes from 'prop-types';
import moment from 'moment';
import _ from 'lodash';

class TrackingTimelineTable extends Component {
  static propTypes = {
    data: PropTypes.observableArray.isRequired, // Trackings
    onTrackingClick: ReactPropTypes.func
  }
  static defaultProps = {
  }
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentWillReceiveProps(nextProps) {
    this.dateMap = {};
    this.dates = this.getDates(nextProps.data);
  }

  componentDidUpdate() {
    this.scrollToRight();
  }

  /** @type {object} <string, {}<trackingId, Transanction>> */
  dateMap = {};

  timeline = null;

  /**
   * @return {Moment[]}
   */
  getDates = (data) => {
    let dates = [];
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[i].Application.Transactions.length; j++) {
        let transaction = data[i].Application.Transactions[j];
        let date = moment(transaction.recordDate);
        let key = date.format();
        if (!this.dateMap.hasOwnProperty(date.format())) {
          dates.push(date);
          this.dateMap[key] = [];
        }
        this.dateMap[key].push({trackingId: data[i].id, transaction}); // Transaction
      }
    }
    dates.sort((a, b) => (a.isBefore(b) ? -1 : 1));
    return dates;
  }

  scrollToRight = () => {
    if (this.timeline) {
      this.timeline.scrollLeft = this.timeline.scrollWidth - this.timeline.offsetWidth;
    }
  }

  handleSidebarItemClick = tracking => {
    if (this.props.onTrackingClick) {
      this.props.onTrackingClick(tracking);
    }
  }

  render() {
    const { data } = this.props;
    const dates = _.get(this, 'dates', []);

    return (
      <div className="TrackingTimelineTable">
        <div className="fixed-sidebar">
          <div className="sidebar-item-head">Applications</div>
          {data.map(tracking => (
            <div className="sidebar-item" key={tracking.id} onClick={this.handleSidebarItemClick.bind(this, tracking)}>
              {tracking.Application.applId} - 
              - {tracking.Application.Transactions.length} Events
            </div>
          ))}
        </div>
        <div className="timeline" ref={el => this.timeline = el}>
          <div className="timeline-item-head">
            {dates.map(date => {
              return (
                <div className="timeline-item-block-head" key={date.format()}>
                  {date.format('YYYY-MM-DD')}
                </div>
              )
            })}
          </div>
          {data.map(tracking => ( // iterate all trackings 
            <div className="timeline-item" key={tracking.id}>
            {dates.map(date => { // for each tracking, build a timeline with entire date set
              let key = date.format();
              let transactionsList = this.dateMap[key].filter(obj => obj.trackingId === tracking.id);
              let tags = null;
              if (transactionsList.length > 1) {
                let popOverContent = (
                  transactionsList.map((transactionObj, keySp) => {
                    return (
                      <Tooltip title={transactionObj.transaction.TransactionCode.description} key={keySp}>
                        <Tag color="#108ee9">{transactionObj.transaction.TransactionCode.code}</Tag>
                      </Tooltip>
                    )
                  })
                );
                tags = (
                  <Popover content={popOverContent} title="">
                    <Tag color="#108ee9">Multiple events</Tag>
                  </Popover>
                );
              } else if (transactionsList.length > 0) {
                tags = (
                  <Tooltip title={transactionsList[0].transaction.TransactionCode.description}>
                    <Tag color="#108ee9">{transactionsList[0].transaction.TransactionCode.code}</Tag>
                  </Tooltip>
                );
              }
              return (
                <div className="timeline-item-block" key={key}>
                  {tags}
                </div>
              )
            })}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default TrackingTimelineTable;
