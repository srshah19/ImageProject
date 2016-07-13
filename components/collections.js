/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, {
    Component,
} from 'react';

import Firebase from 'firebase';

// Spinner to show Loading
import Spinner from 'react-native-loading-spinner-overlay';

import {
    AppRegistry,
    Alert,
    Image,
    ListView,
    Linking,
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    ToolbarAndroid,
    RefreshControl,
    ProgressBar,
    NetInfo,
} from 'react-native';

var cacheResults = {
  data: {
    'results': [],
  }
}

var ScrollableTabView = require('react-native-scrollable-tab-view');

// Shhh.. This is a secret Key! Keep this safe :D
const API_KEY = "79990a4b9b7eb74767c53ed17a039d2046a191f9a4fc33bd853ad272b7e4d199";

String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

class Collections extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2
            }),
            loaded: false,
            count: 1,
            refreshing: false
        };
        this.REQUEST_URL = 'https://api.unsplash.com/collections/featured/?client_id='+API_KEY+'&per_page=5';
    }

    componentDidMount() {
      NetInfo.isConnected.fetch().then(isConnected => {
        // Alert.alert('connected', 'connected', );
      })
        this.fetchData();
    }

    requestURL(
      url = this.REQUEST_URL,
      count = this.state.count){
        return (
          `${url}&page=${count}`
        );
      }

    fetchData() {
        fetch(this.requestURL())
            .then((response) => response.json())
            .then((responseData) => {
                cacheResults.data['results'] = cacheResults.data['results'].concat(responseData);
                this.setState({
                    dataSource: this.getDataSource(cacheResults.data['results']),
                    loaded: true,
                    count: this.state.count + 1,
                    refreshing: false,
                });
            })
            .catch((error) => {
              Alert.alert('Network Error', 'Make sure you have a valid internet connection.')
              console.warn(error);
            })
            .done();
    }

    getDataSource(responseData): ListView.DataSource {
        return this.state.dataSource.cloneWithRows(responseData)
    }

    loadMore() {
        this.setState({
          loaded: false,
          refreshing: true,
        })
        this.fetchData();
    }

    render() {
        return (
            <ListView
                refreshControl={
                  <RefreshControl
                      refreshing={this.state.refreshing}
                      onRefresh={this.loadMore.bind(this)}
                  />
                }
                dataSource={this.state.dataSource}
                renderRow={this.renderCollection}
                style={styles.listView}
                onEndReachedThreshold={10}
                onEndReached={this.loadMore.bind(this)}>
            </ListView>
        );
    }

    renderCollection(collection) {
        return (
            <View style={styles.container}>
                <TouchableHighlight style={styles.imageContainer}
                    activeOpacity={0.5}>
                    <Image
                      resizeMode='contain'
                      source={{uri: collection.cover_photo.urls.regular}}
                      style={styles.thumbnail}
                    />
                </TouchableHighlight>
                <View style={styles.rightContainer}>
                  <Text style={styles.title}>{collection.title.capitalizeFirstLetter()}</Text>
                  <Text style={styles.description}>{(collection.description) ? collection.description: 'N/A'}</Text>
                </View>
            </View>
        );
    }
}

var styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'transparent',
      margin: 10,
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: 'gray'
    },
    rightContainer: {
//       flex: 0.5,
//       flexDirection: 'row',
//       position: 'absolute',
//       top: 25,
//       right: 0,
//       bottom: 0,
//       left: 0
      flex: 1,
      marginTop: 10,
    },
	imageContainer: {
      flex: 1,
      opacity: 0.5,
	},
    title: {
      fontSize: 16,
      marginBottom: 3,
      textAlign: 'center',
      color: '#FFFFFF',
      fontWeight: 'normal',
      fontFamily: 'quicksand_bold'
    },
    content: {
      fontSize: 14,
      textAlign: 'center',
      marginTop: 2,
      color: '#FFFFFF',
      fontFamily: 'quicksand_regular'
    },
    year: {
       textAlign: 'center'
    },
    thumbnail: {
      width: 450,
      height: 250
    },
    listView: {
      paddingBottom: 20,
      marginBottom: 0,
      backgroundColor: '#000000'
    },
    description: {
      fontSize: 14,
      textAlign: 'center',
      marginTop: 5,
      color: '#FFFFFF',
      fontFamily: 'quicksand_regular',
      flex: 0.5,
      flexDirection: 'column'
    },
    toolbarDisplay: {
      backgroundColor: '#8c8c8c',
      height: 50,
      margin: 0,
      padding: 0,
    },
    headerContainer: {
      flex: 1,
      flexDirection: 'column'
    },
});

export default Collections;
