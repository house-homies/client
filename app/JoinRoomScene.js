import React, {
  AsyncStorage,
  Component,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View
} from 'react-native';

var Router = require('./Router.js');
var getName = require('./nameGen.js');

class JoinRoomScene extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: text.joinExistingDefault,
    };
  }

  componentDidMount() {
    this.checkExistingRoom().done();
  }

  async checkExistingRoom() {
    try {
      var roomId = await AsyncStorage.getItem("roomId");
      if (roomId !== null) {
        this.joinRoom(roomId);
      }
    } catch (error) {
    }
  }

  async setName() {
    try {
      var username = await AsyncStorage.getItem("username");
      if (username === null) {
        // generate username
        var username = getName();
        AsyncStorage.setItem("username", username);
      }
    } catch (error) {}
  }

  joinRoom(roomId) {
    // TODO: set room ID in local storage
    this.setName();
    AsyncStorage.setItem("roomId", roomId);
    let route = Router.MessengerScene();
    this.props.navigator.replace(route);
  }

  makeid(length)
  {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < length; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }

  generateNewBuilding() {
    // generate random string
    let roomId = this.makeid(12);
    this.joinRoom(roomId);
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.textInput}
          onChangeText={(text) => this.setState({text})}
          value={this.state.text} />
        <TouchableHighlight underlayColor={'#0061cc'} style={styles.button} onPress={()=>{
          this.joinRoom(this.state.text);
        }}>
          <View>
            <Text style={styles.buttonText}>Join</Text>
          </View>
        </TouchableHighlight>
        <Text>
          OR
        </Text>
        <TouchableHighlight underlayColor={'#0061cc'} style={styles.button} onPress={()=>{
          this.generateNewBuilding();
        }}>
          <View>
            <Text style={styles.buttonText}>Generate New Building</Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  }
}

const text = {
  joinExistingDefault: 'Join existing building',
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
  usernameInfo: {
    flex: 3,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  roomInfo: {
    flex: 4,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 30,
  },
  basicText: {
    textAlign: 'center',
    fontSize: 15,
  },
  textInput: {
    height: 40,
    padding: 7,
    borderColor: 'gray',
    borderWidth: 1,
  },
  button: {
    backgroundColor: '#007aff',
    paddingTop: 7,
    paddingRight: 14,
    paddingBottom: 7,
    paddingLeft: 14,
    borderRadius: 7,
    margin: 7,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});

module.exports = JoinRoomScene;
