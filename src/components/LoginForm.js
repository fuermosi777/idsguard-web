import React, { Component } from 'react';
import { 
  Row,
  Form,
  Input,
  Icon,
  Button,
  Alert,
  Tooltip
} from 'antd';
import './LoginForm.css';
import PropTypes from 'prop-types';

class LoginForm extends Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    errorMessageFromServer: PropTypes.string,
  }
  static defaultProps = {
    errorMessageFromServer: ''
  }
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      emailErrorMessage: '',
      passwordErrorMessage: '',
    };
  }
  handleSubmit = e => {
    e.preventDefault();
    this.props.onSubmit(this.state.email, this.state.password);
  }
  onChangeEmail = e => {
    this.setState({email: e.target.value, emailErrorMessage: ''});
  }
  onChangePassword = e => {
    this.setState({password: e.target.value, passwordErrorMessage: ''});
  }
  render() {
    const { errorMessageFromServer } = this.props;
    const { email, password, emailErrorMessage, passwordErrorMessage } = this.state;
    const isLoginButtonActive = email && password && !emailErrorMessage && !passwordErrorMessage;

    return (
      <Form onSubmit={this.handleSubmit} className="LoginForm">
        <Form.Item>
          <h2>Login to IDS Guard</h2>
        </Form.Item>
        <Form.Item>
          <Input
            prefix={<Icon type="user" className="LoginForm__input-icon" />}
            placeholder="Email" 
            onChange={this.onChangeEmail}
          />
        </Form.Item>
        <Form.Item>
          <Input
            prefix={<Icon type="lock" className="LoginForm__input-icon" />}
            type="password"
            placeholder="Password"
            onChange={this.onChangePassword}
          />
        </Form.Item>
        {errorMessageFromServer ?
          <Form.Item>
            <Alert message={errorMessageFromServer} type="error" showIcon />
          </Form.Item>
        : null}
        <Form.Item>
          <Row type='flex' justify="space-around">
            <Button type="primary" htmlType="submit" disabled={!isLoginButtonActive}>
              Login
            </Button>
            <Tooltip placement="topLeft" title="Please call 123-456-7890">
              <Button type="primary" disabled>Sign up</Button>
            </Tooltip>
          </Row>
        </Form.Item>
      </Form>
    );
  }
}

export default LoginForm;
