const Config = {
  API_URL_BASE: process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:4000/api'
};

export default Config;
