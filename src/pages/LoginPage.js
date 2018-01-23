import React, { Component } from 'react';
import {
  Redirect
} from 'react-router-dom';
import {
  Layout,
  Row,
  Col
} from 'antd';
import userStore from '../stores/userStore';
import './LoginPage.css';
import { observer } from 'mobx-react';
import LoginForm from '../components/LoginForm';

@observer
class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginErrorMessage: ''
    }
  }
  handleSubmit = async (email, password) => {
    try {
      await userStore.login(email, password);
    } catch (err) {
      this.setState({loginErrorMessage: err.message});
    }
  }
  render() {
    const { from } = this.props.location.state || { from: { pathname: '/' } };
    const { loginErrorMessage } = this.state;

    if (userStore.isLoggedIn) {
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
                <LoginForm
                  onSubmit={this.handleSubmit}
                  errorMessageFromServer={loginErrorMessage}
                />
              </Col>
            </Row>
          </Layout.Content>
        </Layout>
      </div>
    );
  }
}

export default LoginPage;