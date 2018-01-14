import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect
} from 'react-router-dom';
import { Layout, Row, Col,
  Form,
  Input,
  Icon,
  Button
} from 'antd';
import appStore from '../stores/appStore';
import './LoginPage.css';
import { observer } from 'mobx-react';

@observer
class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    };
  }
  handleSubmit = e => {
    e.preventDefault();
    appStore.login(this.state.username, this.state.password);
  }
  onChangeUserName = e => {
    this.setState({username: e.target.value});
  }
  onChangePassword = e => {
    this.setState({password: e.target.value});
  }
  render() {
    const { from } = this.props.location.state || { from: { pathname: '/' } };

    if (appStore.isLoggedIn) {
      return (
        <Redirect to={from}/>
      )
    }

    return (
      <div className="LoginPage">
        <Layout>
          <Layout.Content>
            <Row type="flex" justify="space-around">
              <Col span={4}>
                <Form onSubmit={this.handleSubmit} className="login-form">
                  <Form.Item>
                    <h2>Login to IDS Guard</h2>
                  </Form.Item>
                  <Form.Item>
                    <Input
                      prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" 
                      onChange={this.onChangeUserName}
                    />
                  </Form.Item>
                  <Form.Item>
                    <Input
                      prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                      type="password"
                      placeholder="Password"
                      onChange={this.onChangePassword}
                    />
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      Login
                    </Button>
                  </Form.Item>
                </Form>
              </Col>
            </Row>
          </Layout.Content>
        </Layout>
      </div>
    );
  }
}

export default LoginPage;