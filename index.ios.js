/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, {
    Component,
} from 'react';

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
    Dimensions,
} from 'react-native';

let cacheResults = {
  data: {
    'results': [],
  }
};

// Shhh.. This is a secret Key! Keep this safe :D
const API_KEY = "79990a4b9b7eb74767c53ed17a039d2046a191f9a4fc33bd853ad272b7e4d199";
let width = Dimensions.get('window').width; //full width

String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

class ImageProject extends Component {
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
        this.REQUEST_URL = 'https://api.unsplash.com/photos/curated/?client_id='+API_KEY+'&per_page=5';
    }

    componentDidMount() {
      NetInfo.isConnected.fetch().then(isConnected => {
        // Alert.alert('connected', 'connected', );
      });
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

    getPageHeader(){
        return(
          <View style={styles.headerContainer}>
            <ToolbarAndroid
              style={styles.toolbarDisplay}
              titleColor='#fff'
              title={'Unsplash Images'}
            />
          </View>
        )
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
                renderRow={this.renderMovie}
                style={styles.listView}
                onEndReachedThreshold={10}
                renderHeader={() => this.getPageHeader()}
                onEndReached={this.loadMore.bind(this)}>
            </ListView>
        );
    }

    renderMovie(image) {
        return (
            <View style={styles.container}>
                <TouchableHighlight style={styles.imageContainer}
                    onPress={() => Linking.openURL(image.urls.full)}
                    activeOpacity={0.5}>
                    <Image
                      resizeMode="cover"
                      source={{uri: image.urls.regular}}
                      style={styles.thumbnail}
                    />
                </TouchableHighlight>
                <View style={styles.rightContainer}>
                  <View>
                    <Text style={styles.title}>{image.user.username.capitalizeFirstLetter()}</Text>
                    <Text style={styles.content}>Likes: {image.likes}</Text>
                  </View>
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
      backgroundColor: '#F5F5F5',
      margin: 10,
      padding: 10
    },
    rightContainer: {
      flex: 1,
      marginTop: 10
    },
	imageContainer: {
      flex: 1,
	},
    title: {
      fontSize: 16,
      marginBottom: 3,
      textAlign: 'center',
      color: '#000000',
      fontWeight: 'bold'
    },
    content: {
      fontSize: 14,
      textAlign: 'center',
      marginTop: 2
    },
    year: {
      textAlign: 'center'
    },
    thumbnail: {
      width: width - 40,
      height: 250
    },
    listView: {
      paddingBottom: 20,
      marginBottom: 0,
      backgroundColor: '#FFFFFF'
    },
    overlay: {
      flex: 1,
      position: 'absolute',
      left: 0,
      top: 0,
      opacity: 0.5,
      backgroundColor: 'black',
      width: 300
    },
    toolbarDisplay: {
      backgroundColor: '#8c8c8c',
      height: 50,
      margin: 0,
      padding: 0
    },
    headerContainer: {
      flex: 1,
      flexDirection: 'column'
    },
});

AppRegistry.registerComponent('ImageProject', () => ImageProject);
