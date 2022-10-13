import axios from 'axios';
import Config from 'react-native-config';

const instance = axios.create({
  baseURL: Config.API_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-CMC_PRO_API_KEY': Config.COIN_API_KEY,
  },
});

export default instance;
