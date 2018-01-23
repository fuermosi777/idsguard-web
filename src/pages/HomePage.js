import React, { Component } from 'react';
import {
  Layout,
  Menu,
  Icon,
  Input,
  Row,
  Col,
  Alert,
  List,
  Button,
  AutoComplete
} from 'antd';
import './HomePage.css';
import applicationStore from '../stores/applicationStore';
import appStore from '../stores/appStore';
import watchListStore from '../stores/watchListStore';
import { observer } from 'mobx-react';

@observer
class HomePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      applicationData: []
    };
  }
  componentDidMount() {
    watchListStore.getWatchLists();
  }
  handleClick = (e) => {
    if (e.key === 'signout') {
      appStore.logout();
    }
  }

  handleSearch = async value => {
    if (value.length < 8) {
      this.setState({applicationData: []});
    } else {
      try {
        let appls = await applicationStore.searchApplications(value);
        if (!appls || appls.length === 0) {
          // handle empty
        } else {
          this.setState({
            applicationData: appls,
          })
        }
      } catch (err) {
        // handle error
      }
    }
  }

  handleSelectResult = value => {
    console.log(value)
  }

  renderSearchList = (dataSource) => {
    return dataSource.map(data => (
      <AutoComplete.Option key={data.applId}>
        <span className="appl-id">{data.applId} - </span>
        <span className="appl-pub-number">{data.appEarlyPubNumber} - </span>
        <span className="appl-title">{data.patentTitle}</span>
      </AutoComplete.Option>
    ))
  }

  render() {
    const { applicationData, errorMessage, errorType } = this.state;
    return (
      <div className="HomePage">
        <Layout className="main">
          <Layout.Header className="header">
            <Row type="flex" justify="space-between">
              <Col span={16}>
                <AutoComplete
                  className="search-application-input"
                  dataSource={this.renderSearchList(applicationData)}
                  size="large"
                  placeholder="Enter an application number"
                  onSelect={this.handleSelectResult}
                  onSearch={this.handleSearch}
                  defaultActiveFirstOption={false}

                />
              </Col>
              <Col>
                <Menu
                  className="menu"
                  onClick={this.handleClick}
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
              <Row>
                <Col span={16}>
                  <Button type="primary" icon="plus" size="large">Add a new list</Button>
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