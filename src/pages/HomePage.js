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
  Timeline
} from 'antd';
import './HomePage.css';
import applicationSearchStore from '../stores/applicationSearchStore';
import applicationStore from '../stores/applicationStore';
import userStore from '../stores/userStore';
import trackingStore from '../stores/trackingStore';
import { observer } from 'mobx-react';
import _ from 'lodash';
import moment from 'moment';

@observer
class HomePage extends Component {
  constructor(props) {
    super(props);

    this.handleSearchOp = _.debounce(this.handleSearch, 500);

    this.state = {
      errorMessage: ''
    };
  }
  componentDidMount() {
    trackingStore.getTrackings();
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

  handleApplicationClick = async applicationId => {
    try {
      await applicationStore.getApplication(applicationId);
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
              <Row gutter={10}>
                <Col span={12}>
                  {errorMessage ? 
                    <Alert message={errorMessage} type="error" showIcon />
                  : null}
                  <List
                    className="appl-list"
                    itemLayout="vertical"
                    size="large"
                    dataSource={trackingStore.trackings}
                    renderItem={item => (
                      <List.Item
                        key={_.get(item, 'Application.applId')}
                      >
                        <List.Item.Meta
                          title={_.get(item, 'Application.appEarlyPubNumber')}
                          description={_.get(item, 'Application.patentTitle')}
                        />
                        <Button type="primary" icon="right" onClick={this.handleApplicationClick.bind(this, item.applicationId)}>Transaction History</Button>
                      </List.Item>
                    )}
                  />
                </Col>
                <Col span={12}>
                  {_.get(applicationStore, 'application') ?
                    <Timeline className="appl-timeline">
                      {this.renderTimeline(_.get(applicationStore, 'application.Transactions'))}
                    </Timeline>
                  : null}
                </Col>
              </Row>
            </Layout.Content>
          </Layout>
          <Layout.Footer>IDS Guard &copy; 2017 - present</Layout.Footer>
        </Layout>
      </div>
    );
  }
}

export default HomePage;