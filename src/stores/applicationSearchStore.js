import { observable, action } from "mobx";
import axios from '../utils/axios';
import _ from 'lodash';
import Err from '../utils/error';

class ApplicationSearchStore {
  @observable applications = [];

  @action async searchApplications(query) {
    try {
      let response = await axios.get(`applicationsearch?applicationNumber=${query}`)
      let error = _.get(response, 'data.error');
      if (error) {
        throw Err.CustomError(error);
      }
      let data = _.get(response, 'data');
      if (data && data.length > 0) {
        this.applications = data;
      } else {
        this.applications = [];
      }
    } catch(err) {
      this.applications = [];
      throw err;
    }
  }

  @action clearApplications() {
    this.applications = [];
  }
}

export default new ApplicationSearchStore();