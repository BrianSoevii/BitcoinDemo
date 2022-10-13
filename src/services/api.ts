import services from './services';
import {showMessage} from 'react-native-flash-message';
import serviceList from './serviceList';
import NetInfo from '@react-native-community/netinfo';
import {TServiceList} from 'src/types';
import AuthState from 'src/store/AuthState';
import axios from 'axios';
import {EventRegister} from 'react-native-event-listeners';
// import {AuthState, UserState} from 'src/store';

type TServiceType = 'post' | 'get' | 'put' | 'delete';

const api = async (
  type: TServiceType,
  url: TServiceList,
  params?: Object,
  urlParam?: string | number,
  silent: boolean = false,
  selectedInstance: 'v1' | 'v2' = 'v1',
) => {
  const instance =
    selectedInstance === 'v1'
      ? services.legacyInstance
      : services.concreteInstance;

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
      ? `${serviceList[url]}/${urlParam}`.trim()
      : serviceList[url].trim();
    const cancelToken = axios.CancelToken.source();

    setTimeout(() => {
      cancelToken.cancel();
    }, 60000);
    try {
      if (type === 'get') {
        await instance
          .get(auxUrl, {params: params})
          .then(async (response: any) => {
            EventRegister.emit('errorOnServer', false);

            resolve({data: response.data, status: response.status});
          });
      } else if (type === 'delete') {
        instance
          .delete(auxUrl, {data: params})
          .then(async (response: any) => {
            EventRegister.emit('errorOnServer', false);

            resolve({data: response.data, status: response.status});
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
          .catch(e => reject(e));
      } else if (type === 'put') {
        await instance
          .put(auxUrl, {data: params})
          .then(async (response: any) => {
            EventRegister.emit('errorOnServer', false);
            resolve({data: response.data, status: response.status});
            if (silent) {
              return;
            }
          });
      } else {
        await instance
          .post(auxUrl, params, {cancelToken: cancelToken.token})
          .then(async response => {
            if (response.data.message) {
              showMessage({
                duration: 2500,

                message: 'Éxito',
                description: response.data.message,
                type: 'success',
                icon: 'success',
              });
            }
            EventRegister.emit('errorOnServer', false);
            resolve({data: response.data, status: response.status});
          });
      }
    } catch (error: any) {
      try {
        EventRegister.emit('errorOnServer', true);
        if (error.response.status === 401) {
          AuthState.reset();
        }
        if (__DEV__) {
          console.log(
            'error en:',
            `${instance.defaults.baseURL}${auxUrl}`,
            error.response.data,
          );
        }
        if (!silent) {
          showMessage({
            duration: 2500,
            message: 'Error',
            description: error.response.data.message,
            type: 'danger',
            icon: 'danger',
          });
        }

        reject(error);
      } catch (e) {
        EventRegister.emit('errorOnServer', true);
        reject('general error');
      }
    }
  });
};

export default api;
