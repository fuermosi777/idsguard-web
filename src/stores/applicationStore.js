import { observable, computed, action } from "mobx";
import axios from 'axios';
import store from 'store';

const API_URL = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:4000/api'

class ApplicationStore {
  @observable applications = [];

  @action getApplications() {
    axios.get(`${API_URL}/applications`)
      .then(response => {
        console.log(response);
      }).catch(err => {
        console.log(err);
      });
  }
}

export default new ApplicationStore();