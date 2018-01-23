import { observable, action } from "mobx";
import axios from 'axios';
import Config from '../config';
import _ from 'lodash';
import Err from '../utils/error';

class WatchListStore {
  @observable watchLists = [];

  @action async getWatchLists(query) {
    try {
      let response = await axios.get(`${Config.API_URL_BASE}/watchlists`)
      let error = _.get(response, 'data.error');
      if (error) {
        throw Err.CustomError(error);
      }
      let data = _.get(response, 'data');

      this.watchLists = data;
      
    } catch(err) {
      throw err;
    }
  }
}

export default new WatchListStore();