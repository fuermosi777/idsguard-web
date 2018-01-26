import { observable, computed, action } from "mobx";
import axios from '../utils/axios';
import Err from '../utils/error';
import _ from 'lodash';

class AppStore {
  @observable notifications = [];

  @action async getNotifications() {
    try {
      let response = await axios.get('notifications');
      let error = _.get(response, 'data.error');
      if (error) {
        throw Err.CustomError(error);
      }
      let data = _.get(response, 'data');
      if (data) {
        this.notifications = data;
      }
    } catch (err) {
      throw err;
    }
  }
}

export default new AppStore();