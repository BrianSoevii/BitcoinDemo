import axios from 'axios';
import Config from 'react-native-config';

const instance = axios.create({
  baseURL: 'https://pro-api.coinmarketcap.com/',
  headers: {
    'X-CMC_PRO_API_KEY': Config.COIN_API_KEY!,
  },
});

export default instance;
