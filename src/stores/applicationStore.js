import { observable, action } from "mobx";
import axios from 'axios';
import store from 'store';
import Config from '../config';

class ApplicationStore {
  @observable applications = [];

  @action async searchApplications(query) {
    try {
      let response = await axios.get(`${Config.API_URL_BASE}/applications?applicationNumber=${query}`)
      console.log(response);
    } catch(err) {
      throw err;
    }
  }
}

export default new ApplicationStore();