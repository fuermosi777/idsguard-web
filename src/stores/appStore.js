import { observable, computed, action } from "mobx";
import axios from 'axios';
import store from 'store';

const API_URL = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:4000/api'

class AppStore {
  @observable user = null;

  @computed get isLoggedIn() {
    return Boolean(this.user);
  }

  @action login(email, password) {
    axios.post(`${API_URL}/login`, {email, password})
      .then(response => {
        this.user = {};
      }).catch(err => {
        console.log(err);
      });
  }
}

export default new AppStore();