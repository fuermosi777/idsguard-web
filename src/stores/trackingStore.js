import { observable, action } from "mobx";
import axios from '../utils/axios';
import _ from 'lodash';
import Err from '../utils/error';

class TrackingStore {
  @observable trackings = [];

  @action async getTrackings(query) {
    try {
      let response = await axios.get(`trackings`)
      let error = _.get(response, 'data.error');
      if (error) {
        throw Err.CustomError(error);
      }
      let data = _.get(response, 'data');

      this.trackings = data;
      
    } catch(err) {
      throw err;
    }
  }

  @action async createTracking(applicationId) {
    try {
      let response = await axios.post(`trackings`, {
        applicationId
      })
      let error = _.get(response, 'data.error');
      if (error) {
        throw Err.CustomError(error);
      }
      
      await this.getTrackings();
    } catch(err) {
      throw err;
    }
  }

  @action async deleteTracking(trackingId) {
    try {
      let response = await axios.delete(`trackings/${trackingId}`)
      let error = _.get(response, 'data.error');
      if (error) {
        throw Err.CustomError(error);
      }
      
      await this.getTrackings();
    } catch(err) {
      throw err;
    }
  }
}

export default new TrackingStore();