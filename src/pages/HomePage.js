import React, { Component } from 'react';
import {
  Layout,
  Menu,
  Icon,
  Row,
  Col,
  Alert,
  List,
  Button,
  AutoComplete,
  Timeline,
  Modal,
  Popconfirm,
  message,
  Collapse,
  Badge
} from 'antd';
import TrackingTimelineTable from '../components/TrackingTimelineTable';
import './HomePage.css';
import applicationSearchStore from '../stores/applicationSearchStore';
import userStore from '../stores/userStore';
import trackingStore from '../stores/trackingStore';
import notificationStore from '../stores/notificationStore';
import { observer } from 'mobx-react';
import _ from 'lodash';
import moment from 'moment';

@observer
class HomePage extends Component {
  constructor(props) {
    super(props);

    this.handleSearchOp = _.debounce(this.handleSearch, 500);

    this.state = {
      errorMessage: '',
      isModalOpen: false
    };
  }
  componentDidMount() {
    trackingStore.getTrackings();
    notificationStore.getNotifications();
  }

  handleCloseModal = () => {
    this.setState({isModalOpen: false});
  }

  handleSignoutClick = (e) => {
    if (e.key === 'signout') {
      userStore.logout();
    }
  }

  handleSearch = async value => {
    this.setState({errorMessage: ''});
    try {
      await applicationSearchStore.searchApplications(value);
    } catch (err) {
      // handle error
    }
  }

  handleSearchChange = value => {
    applicationSearchStore.clearApplications();
  }

  handleSelectResult = async value => {
    try {
      await trackingStore.createTracking(value);
    } catch (err) {
      this.setState({errorMessage: err.message});
    }
  }

  handleTrackingClick = tracking => {
    trackingStore.selectTracking(tracking);
    this.setState({isModalOpen: true});
  }

  handleDeleteTracking = async trackingId => {
    try {
      await trackingStore.deleteTracking(trackingId);
      message.success('Successfully untracked.')
      this.setState({isModalOpen: false});
    } catch (err) {
      // handle error
    }
  }

  renderSearchList = (dataSource) => {
    return dataSource.map(data => (
      <AutoComplete.Option key={data.applId} value={data.applId}>
        <span className="appl-id">{data.applId} - </span>
        <span className="appl-pub-number">{data.appEarlyPubNumber} - </span>
        <span className="appl-title">{data.patentTitle}</span>
      </AutoComplete.Option>
    ))
  }

  renderTimeline = (transactions) => {
    if (!transactions) return null;

    return transactions.map((transaction, key) => (
      <Timeline.Item
        key={key}
        color={_.get(transaction, 'TransactionCode.color') || 'blue'}
        dot={key === 0 ? <Icon type="clock-circle-o" style={{ fontSize: '16px' }} /> : null}
      >{moment(transaction.recordDate).format('YYYY-MM-DD')} {transaction.TransactionCode.description}</Timeline.Item>
    ));
  }

  render() {
    const { errorMessage } = this.state;
    return (
      <div className="HomePage">
        <Layout className="main">
          <Layout.Header className="header">
            <Row type="flex" justify="space-between">
              <Col span={16}>
                <AutoComplete
                  className="search-application-input"
                  dataSource={this.renderSearchList(applicationSearchStore.applications)}
                  size="large"
                  placeholder="Enter an application number"
                  onSelect={this.handleSelectResult}
                  onSearch={this.handleSearchOp}
                  onChange={this.handleSearchChange}
                  defaultActiveFirstOption={false}

                />
              </Col>
              <Col>
                <Menu
                  className="menu"
                  onClick={this.handleSignoutClick}
                  mode="horizontal"
                >
                  <Menu.Item key="dashboard">
                    <Icon type="desktop" />Dashboard
                  </Menu.Item>
                  <Menu.SubMenu title={<span><Icon type="setting" />Settings</span>}>
                    <Menu.Item key="signout">Sign out</Menu.Item>
                  </Menu.SubMenu>
                </Menu>
              </Col>
            </Row>
          </Layout.Header>
          <Layout>
            <Layout.Content className="content">
              <TrackingTimelineTable
                data={trackingStore.trackings}
                onTrackingClick={this.handleTrackingClick}
              />

              <div style={{height: '40px'}}></div>

              <h3>New Events <Badge count={notificationStore.notifications.length}/></h3>

              <List
                bordered
                dataSource={notificationStore.notifications}
                renderItem={item => (
                  <List.Item key={item.id} className="notification-list-item">
                    <List.Item.Meta
                      title={moment(item.Transaction.recordDate).format('YYYY-MM-DD') + ' ' + item.Transaction.Application.applId}
                      description={item.Transaction.TransactionCode.description}
                    />
                  </List.Item>
                )}
              />

            </Layout.Content>
          </Layout>
          <Layout.Footer>IDS Guard &copy; 2017 - present</Layout.Footer>
        </Layout>


        <Modal
          title="Application Information"
          visible={this.state.isModalOpen}
          onOk={this.handleCloseModal}
          closable={false}
          destroyOnClose
          footer={[
            <Popconfirm key="untrack" title="Are you sure remove this application from your watch list?" onConfirm={this.handleDeleteTracking.bind(this, _.get(trackingStore, 'tracking.id'))} okText="Yes" cancelText="No">
              <Button type="danger">Untrack</Button>
            </Popconfirm>,
            <Button key="close" type="primary" onClick={this.handleCloseModal}>
              Close
            </Button>,
          ]}
        >
          <Collapse accordion defaultActiveKey={['basic']}>
            <Collapse.Panel header="Appliation Data" key="basic">
              {_.get(trackingStore, 'tracking') ?
                <List
                  itemLayout="horizontal"
                  dataSource={trackingStore.trackingData}
                  renderItem={item => (
                    <List.Item>
                      <List.Item.Meta
                        title={item.title}
                        description={item.description}
                      />
                    </List.Item>
                  )}
                />
              : null}
            </Collapse.Panel>
            <Collapse.Panel header="Transaction History" key="timeline">
              {_.get(trackingStore, 'tracking') ?
                <Timeline className="appl-timeline">
                  {this.renderTimeline(_.get(trackingStore, 'tracking.Application.Transactions'))}
                </Timeline>
              : null}
            </Collapse.Panel>
          </Collapse>
        </Modal>
      </div>
    );
  }
}

export default HomePage;