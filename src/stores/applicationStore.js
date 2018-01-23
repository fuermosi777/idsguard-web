import { observable } from "mobx";
import axios from 'axios';
import Config from '../config';
import _ from 'lodash';
import Err from '../utils/error';

class ApplicationStore {
  @observable application = null;

  async getApplication(applicationId) {
    try {
      let response = await axios.get(`${Config.API_URL_BASE}/applications?id=${applicationId}`)
      let error = _.get(response, 'data.error');
      if (error) {
        throw Err.CustomError(error);
      }
      let data = _.get(response, 'data');
      if (data) {
        this.application = data;
      }
    } catch(err) {
      throw err;
    }
  }
}

export default new ApplicationStore();