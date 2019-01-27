import Axios from 'axios';

const request = Axios.create({ baseURL: 'https://api.barcart.net/' });

export default request;
