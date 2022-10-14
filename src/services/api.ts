import instance from './services';
import {showMessage} from 'react-native-flash-message';
import serviceList from './serviceList';
import NetInfo from '@react-native-community/netinfo';
import {TServiceList} from '../types';

type TServiceType = 'post' | 'get' | 'put' | 'delete';

const services = async (
  type: TServiceType,
  url: TServiceList,
  params?: Object,
  urlParam?: string | number,
  silent: boolean = false,
) => {
  const networkStatus = await NetInfo.fetch();
  if (!networkStatus.isConnected) {
    return new Promise((resolve, reject) => {
      showMessage({
        message: 'Sin conexión',
        description: 'No conectado a internet',
        type: 'danger',
        icon: 'danger',
      });
      reject('No internet connection');
    });
  }

  return new Promise(async (resolve, reject) => {
    const auxUrl = urlParam
      ? `${serviceList[url]}/${urlParam}`
      : serviceList[url];
    try {
      if (type === 'get') {
        await instance
          .get(auxUrl, {params: params})
          .then(async (response: any) => {
            resolve(response.data);
          });
      } else if (type === 'delete') {
        instance
          .delete(auxUrl, {data: params})
          .then(async (response: any) => {
            resolve(response.data);
            if (silent) {
              return;
            }
            showMessage({
              duration: 2500,
              message: 'Éxito',
              description: 'El proceso se realizó correctamente',
              type: 'success',
              icon: 'success',
            });
          })
          .catch(e => console.log(e));
      } else if (type === 'put') {
        await instance.put(auxUrl, params).then(async (response: any) => {
          resolve(response.data);
          if (silent) {
            return;
          }
          showMessage({
            duration: 2500,

            message: 'Éxito',
            description: 'El proceso se realizó correctamente',
            type: 'success',
            icon: 'success',
          });
        });
      } else {
        await instance.post(auxUrl, params).then(async response => {
          if (response.data.message) {
            showMessage({
              duration: 2500,
              message: 'Éxito',
              description: response.data.message,
              type: 'success',
              icon: 'success',
            });
          }
          resolve(response.data);
        });
      }
    } catch (error: any) {
      reject(error);
      if (error.response === undefined) {
        showMessage({
          duration: 5000,
          message: 'Error',
          description: 'No se ha podido conectar con el servidor',
          type: 'danger',
          icon: 'danger',
        });
        return;
      }
      if (__DEV__) {
        console.log(
          'error en:',
          instance.defaults.baseURL + auxUrl,
          JSON.stringify(error.response.data.status.error_message),
        );
      }
      if (silent) {
        return;
      }
      try {
        showMessage({
          duration: 2500,
          message: 'Error',
          description: error.response.data.status.error_message,
          type: 'danger',
          icon: 'danger',
        });
      } catch (e) {
        showMessage({
          duration: 5000,
          message: 'Error',
          description: 'No se ha podido realizar la tarea',
          type: 'danger',
          icon: 'danger',
        });
      }
    }
  });
};

export default services;
