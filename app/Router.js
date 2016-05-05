import React, {
  AsyncStorage,
  StatusBar,
  Platform,
} from 'react-native';

var Button = require('react-native-button');

let Router = {
  RoomId: "House Homies",
  MessengerScene() {
    return {
      getSceneClass() {
        return require('./MessengerScene');
      },
      getTitle() {
        return Router.RoomId;
      },
      renderRightButton(navigator) { return (
          <Button onPress={() => {
            let route = Router.SettingsScene();
            navigator.push(route);
          }}>
            Settings
          </Button>
        );
      },
    };
  },

  SettingsScene() {
    return {
      getSceneClass() {
        return require('./SettingsScene');
      },
      getTitle() {
        return 'Settings';
      },
      renderLeftButton(navigator) {
        return (
          <Button onPress={() => { navigator.pop() }}>
            Back
          </Button>
        );
      },
    }
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
