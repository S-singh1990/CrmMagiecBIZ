/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';

messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
});

messaging().getInitialNotification(async remoteMessage => {
    console.log('Message handled in the kill state!', remoteMessage);
});

const handleForegroundMessage = async remoteMessage => {
    console.log('Message handled in the foreground!', remoteMessage);
};

messaging().onMessage(handleForegroundMessage);

AppRegistry.registerComponent(appName, () => App);
