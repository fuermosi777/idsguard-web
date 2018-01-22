import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';
import {
  Layout,
  Menu,
  Icon,
  Input,
  Row,
  Col,
} from 'antd';
import './HomePage.css';
import applicationStore from '../stores/applicationStore';
import appStore from '../stores/appStore';
import { observer } from 'mobx-react';
import _ from 'lodash';

@observer
class HomePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      applicationData: []
    }
  }
  componentDidMount() {

  }
  handleClick = (e) => {
    if (e.key === 'signout') {
      appStore.logout();
    }
  }

  handleSearch = async value => {
    if (!value) {
      this.setState({applicationData: []});
    } else {
      try {
        let appls = await applicationStore.searchApplications(value);
        console.log(appls);
      } catch (err) {
        console.log(err);
      }
    }
  }

  handleSelectResult = value => {
    console.log(value)
  }
  render() {
    const { applicationData } = this.state;

    return (
      <div className="HomePage">
        <Layout className="main">
          <Layout.Header className="header">
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
          </Layout.Header>
          <Layout>
            <Layout.Content className="content">
              <Row>
                <Col span={8}>
                  <Input.Search
                    className="search-application-input"
                    size="large"
                    placeholder="Enter an application number"
                    onSearch={this.handleSearch}
                  />
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