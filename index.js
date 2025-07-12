/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {Provider} from 'react-redux';
import store from './app/redux/store';
import Toast from 'react-native-toast-message';
import 'react-native-get-random-values';

const Root = () => (
  <Provider store={store}>
    <App />
    <Toast />
  </Provider>
);

AppRegistry.registerComponent(appName, () => Root);
