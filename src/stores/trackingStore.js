import { observable, action, computed } from "mobx";
import axios from '../utils/axios';
import _ from 'lodash';
import Err from '../utils/error';
import moment from 'moment';

class TrackingStore {
  @observable tracking = null;
  @observable trackings = [];

  /** @type {<title: string, description: string>[]} */
  @computed get trackingData() {
    if (this.application === null) return [];
    return [
      {title: 'Application Number', description: this.tracking.Application.applId},
      {title: 'Filing or 371 (c) Date', description: moment(this.tracking.Application.appFilingDate).format('YYYY-MM-DD')},
    ];
  }

  @action selectTracking(tracking) {
    this.tracking = tracking;
  }

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