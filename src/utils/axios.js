import axios from 'axios';
import Config from '../config';

let instance = axios.create({
  baseURL: Config.API_URL_BASE
});

export default instance;