import { observable, computed, action } from "mobx";
import axios from 'axios';
import store from 'store';
import Config from '../config';
import _ from 'lodash';
import Err from '../utils/error';
import StoreKey from '../enums/storeKey';

class UserStore {
  @observable userToken = null;
  @observable user = null;

  @computed get isLoggedIn() {
    return Boolean(this.userToken);
  }

  /**
   * Get user token from localStorage if possible
   */
  @action init() {
    let userToken = store.get(StoreKey.UserToken.name);
    if (userToken) {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + userToken;
      this.userToken = userToken;
    }
  }

  @action logout() {
    this.userToken = null;
    store.remove(StoreKey.UserToken.name);
    axios.defaults.headers.common['Authorization'] = '';
  }

  @action async login(email, password) {
    try {
      let response = await axios.post(`${Config.API_URL_BASE}/login`, {email, password})
      let error = _.get(response, 'data.error');
      if (error) {
        throw Err.CustomError(error);
      }
      let data = _.get(response, 'data');

      this.userToken = data.token;
      store.set(StoreKey.UserToken.name, this.userToken);
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.userToken;

      return data;
    } catch (err) {
      throw err;
    }
  }
}

export default new UserStore();