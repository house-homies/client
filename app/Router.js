import React, {
  StatusBar,
  Platform,
} from 'react-native';

let Router = {
  MessengerScene() {
    return {
      getSceneClass() {
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
        return 'Join Room';
      }
    }
  },
};

module.exports = Router;
