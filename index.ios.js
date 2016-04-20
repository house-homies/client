import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View,
  ListView,
  TextInput,
  ScrollView,
  TouchableHighlight,
  RecyclerViewBackedScrollView
} from 'react-native';
import moment from 'moment';
import update from 'react-addons-update';
import NavBar, { NavButton, NavButtonText, NavTitle } from 'react-native-nav'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import InvertibleScrollView from 'react-native-invertible-scroll-view';

var MOCKED_MESSAGES_DATA = [
  {username: 'Jonah',   timestamp: '2016-04-13T12:29:14', body: 'Test Message'},
  {username: 'Zane',    timestamp: '2016-04-13T12:29:14', body: 'Test Message'},
  {username: 'Katie',   timestamp: '2016-04-13T12:29:14', body: 'Test Message'},
  {username: 'Ty',      timestamp: '2016-04-13T12:29:14', body: 'Test Message'},
  {username: 'Jonah',   timestamp: '2016-04-14T12:29:14', body: 'Test Message'},
  {username: 'Ty',      timestamp: '2016-04-14T12:29:14', body: 'Test Message'},
  {username: 'Zane',    timestamp: '2016-04-14T12:29:14', body: 'Test Message'},
  {username: 'Katie',   timestamp: '2016-04-14T12:29:14', body: 'Test Message'},
  {username: 'Zane',    timestamp: '2016-04-14T12:29:14', body: 'Test Message'},
  {username: 'Ty',      timestamp: '2016-04-14T12:29:14', body: 'Test Message'},
  {username: 'Tristan', timestamp: '2016-04-15T12:29:14', body: 'Test Message'},
  {username: 'Katie',   timestamp: '2016-04-15T12:29:14', body: 'Test Message'},
  {username: 'Tristan', timestamp: '2016-04-15T12:29:14', body: 'Test Message'},
  {username: 'Tristan', timestamp: '2016-04-15T12:29:14', body: 'Test Message'},
  {username: 'Zane',    timestamp: '2016-04-15T12:29:14', body: 'Test Message'},
];

class MyNavBar extends Component {
  render() {
    return (
      <NavBar>
        <NavButton onPress={() => alert('hi')}>
          <NavButtonText>
            {"Rooms"}
          </NavButtonText>
        </NavButton>
        <NavTitle>
          {"House Homies"}
        </NavTitle>
        <NavButton onPress={() => alert('hi')}>
          <NavButtonText>
            {"Settings"}
          </NavButtonText>
        </NavButton>
      </NavBar>
    );
  }
}

class HouseHomies extends Component {
  constructor(props) {
    super(props);
    this.messages = MOCKED_MESSAGES_DATA;
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
    };
  }
  
  componentDidMount() {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(this.messages)   
    });
  }
  
  _sendMessage(text) {
    var message = { username: "Hubot", timestamp: moment().format(), body: text };
    
    this.messages.push(message);
    var messages = this.messages;
    var messageIds = messages.map((row, index) => index).reverse();
    
    this.setState({ 
      dataSource: this.state.dataSource.cloneWithRows(messages, messageIds)
    });
    this.refs.messages.scrollTo({y: messages.length * -1 * 25, animated: true});
  }
  
  renderMessage(message) {
    let date = moment(message.timestamp).calendar();
    return (
      <View style={styles.messageContainer}>
        <View style={styles.messageMetaContainer}>
          <Text style={styles.messageUsername}>{message.username}</Text>
          <Text style={styles.messageTimestamp}>{date}</Text>
        </View>
        <Text style={styles.messageBody}>{message.body}</Text>
      </View>
    );
  }

  render() {
    return (
      <View  style={{flex: 1}}>
        <MyNavBar/>
        <View style={{flex: 1}}>
          <ListView
            renderScrollComponent={props => <InvertibleScrollView {...props} inverted />}
            dataSource={this.state.dataSource}
            renderRow={this.renderMessage}
            style={styles.listView}
            ref="messages"
          />
        </View>
        <View style={{height: 40, padding: 5, flexDirection: "row"}}>
          <TextInput
            style={{flex: 0.8}}
            returnKeyType={'send'}
            placeholder = "Message"
            value={this.state.messageInput}
            onChangeText={(messageInput) => this.setState({messageInput})}
            onSubmitEditing={(event) => this._sendMessage(event.nativeEvent.text)}
          />
          <TouchableHighlight style={{flex: 0.2}} onPress={() => this._sendMessage("Pressed send button")}>
            <Text>Send</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  listView: {
    paddingTop: 10,
    backgroundColor: '#F5FCFF',
  },
  messageContainer: {
    margin: 5
  },
  messageMetaContainer: {
    flexDirection: 'row'
  },
  messageUsername: {
   fontWeight: 'bold',
   marginRight: 5
  },
  messageTimestamp: {
    color: 'grey'
  },
  messageBody: {
    
  },
});

AppRegistry.registerComponent('HouseHomies', () => HouseHomies);
