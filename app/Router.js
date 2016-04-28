import React, {
  StatusBar,
  Platform,
} from 'react-native';

let Router = {
  MessengerScene() {
    return {
      getSceneClass() {
        if (Platform.OS === 'ios') {
          StatusBar.setBarStyle('light-content');
        }
        return require('./MessengerScene');
      },
      getTitle() {
        return 'House Homies';
      },
    };
  },

  JoinRoomScene() {
    return {
      getSceneClass() {
        return require('./JoinRoomScene');
      },
      getTitle() {
        return 'Join New Room';
      }
    }
  },
};

module.exports = Router;
