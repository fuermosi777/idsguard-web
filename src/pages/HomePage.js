import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';
import { Layout } from 'antd';
import './HomePage.css';
import applicationStore from '../stores/applicationStore';
import { observer } from 'mobx-react';

@observer
class HomePage extends Component {
  constructor(props) {
    super(props);
    applicationStore.getApplications();
  }
  componentDidMount() {

  }
  render() {
    return (
      <div className="HomePage">
        <Layout>
          
        </Layout>
      </div>
    );
  }
}

export default HomePage;