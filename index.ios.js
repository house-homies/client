import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View,
  ListView,
  TextInput
} from 'react-native';
import moment from 'moment';
import update from 'react-addons-update';
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

class HouseHomies extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: MOCKED_MESSAGES_DATA,
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
    };
  }

  componentDidMount() {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(this.state.messages)   
    });
  }
  
  _sendMessage(text) {
    var message = { username: "Hubot", timestamp: moment().format(), body: text };
    var newMessages = update(this.state.messages, {$push: [message]});
    this.setState({ 
      messages: newMessages,
      dataSource: this.state.dataSource.cloneWithRows(newMessages)
    });
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
      <View>
        <View style={styles.jumbotron}>
          <Text style={styles.jumbotronText}>House Homies</Text>
        </View>
        <TextInput
          style={{height: 40, padding: 5}}
          returnKeyType={'send'}
          placeholder = "Message"
          value={this.state.messageInput}
          onChangeText={(messageInput) => this.setState({messageInput})}
          onSubmitEditing={(event) => this._sendMessage(event.nativeEvent.text)}
        />
        <ListView
          renderScrollComponent={props => <InvertibleScrollView {...props} inverted />}
          dataSource={this.state.dataSource}
          renderRow={this.renderMessage}
          style={styles.listView}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  jumbotron: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightblue',
    paddingTop: 25,
    paddingBottom: 10,
  },
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
