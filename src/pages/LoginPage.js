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
  Button,
  Alert
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
      password: '',
      errorMessage: ''
    };
  }
  handleSubmit = async e => {
    e.preventDefault();
    try {
      await appStore.login(this.state.username, this.state.password);
    } catch (err) {
      this.setState({errorMessage: err.message});
    }
  }
  onChangeUserName = e => {
    this.setState({username: e.target.value, errorMessage: ''});
  }
  onChangePassword = e => {
    this.setState({password: e.target.value, errorMessage: ''});
  }
  render() {
    const { from } = this.props.location.state || { from: { pathname: '/' } };
    const { errorMessage } = this.state;

    if (appStore.isLoggedIn) {
      return (
        <Redirect to={from}/>
      )
    }

    return (
      <div className="LoginPage">
        <Layout className="main">
          <Layout.Content>
            <Row type="flex" justify="space-around">
              <Col>
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
                  {errorMessage ?
                    <Form.Item>
                      <Alert message={errorMessage} type="error" showIcon />
                    </Form.Item>
                  : null}
                  <Form.Item>
                    <Row type='flex' justify="space-around">
                      <Button type="primary" htmlType="submit">
                        Login
                      </Button>
                      <Button type="primary" disabled>Sign up</Button>
                    </Row>
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