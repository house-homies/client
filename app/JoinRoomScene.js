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
var HORSE = require('./HORSE/HORSE.JS');

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
        var username = HORSE.RANDOMHORSENAME();
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
        <TouchableHighlight underlayColor={'white'} style={styles.button} onPress={()=>{
          this.joinRoom(this.state.text);
        }}>
          <View>
            <Text style={styles.buttonText}>Join</Text>
          </View>
        </TouchableHighlight>
        <Text>
          OR
        </Text>
        <TouchableHighlight underlayColor={'white'} style={styles.button} onPress={()=>{
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  textInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
  },
  button: {
    backgroundColor: 'gray',
    padding: 5,
  },
});

module.exports = JoinRoomScene;
