import React, {
  AsyncStorage,
  Navigator,
  Platform,
  StatusBar,
  StyleSheet,
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
          <Button style={styles.rightNavButton} onPress={() => {
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
          <Button style={styles.leftNavButton} onPress={() => { navigator.pop() }}>
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

const styles = StyleSheet.create({
  leftNavButton: {
    marginTop: 11,
    marginLeft: 7,
  },
  rightNavButton: {
    marginTop: 11,
    marginRight: 7,
  }
});

module.exports = Router;
