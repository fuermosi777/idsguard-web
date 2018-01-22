import { observable, computed, action } from "mobx";
import axios from 'axios';
import store from 'store';
import Config from '../config';
import _ from 'lodash';
import Err from '../utils/error';
import StoreKey from '../enums/storeKey';

class AppStore {
  @observable userToken = null;

  @computed get isLoggedIn() {
    return Boolean(this.userToken);
  }

  @action init() {
    let userToken = store.get(StoreKey.UserToken.name);
    if (userToken) {
      this.userToken = userToken;
    }
  }

  @action logout() {
    this.userToken = null;
    store.remove(StoreKey.UserToken.name);
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

      return data;
    } catch (err) {
      throw err;
    }
  }
}

export default new AppStore();