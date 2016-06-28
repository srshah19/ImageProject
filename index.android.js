/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, {
    Component,
} from 'react';

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
} from 'react-native';

var cacheResults = {
  data: {
    'results': [],
  }
}

class ImageProject extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2
            }),
            loaded: false,
            count: 1
        };
        this.REQUEST_URL = 'https://api.unsplash.com/photos/curated/?client_id=79990a4b9b7eb74767c53ed17a039d2046a191f9a4fc33bd853ad272b7e4d199&per_page=15';
    }

    componentDidMount() {
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
                });
            })
            .done();
    }

    getDataSource(responseData): ListView.DataSource {
      return this.state.dataSource.cloneWithRows(responseData)
    }

    loadMore() {
      this.setState({
        loaded: false
      })
      this.fetchData();
    }

    render() {
        return (
            <ListView
                dataSource={this.state.dataSource}
                renderRow={this.renderMovie}
                style={styles.listView}
                onEndReachedThreshold={10}
                onEndReached={this.loadMore.bind(this)}>
            </ListView>
        );
    }

    renderLoadingView() {
        return (
            <View style={styles.overlay}>
                <Text>
                    Loading Images...
                </Text>
            </View>
        );
    }

    renderMovie(image) {
        return (
            <View style={styles.container}>
                <TouchableHighlight
                    onPress={() => Linking.openURL(image.urls.full)}
                    activeOpacity={0.5}>
                    <Image
                        source={{uri: image.urls.thumb}}
                        style={styles.thumbnail}
                    />
                </TouchableHighlight>
                <View style={styles.rightContainer}>
                    <Text style={styles.title}>{image.user.username}</Text>
                    <Text style={styles.content}>Likes: {image.likes}</Text>
                </View>
            </View>
        );
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        margin: 10,
        padding: 10
    },
    rightContainer: {
        flex: 1
    },
    title: {
        fontSize: 16,
        marginBottom: 3,
        textAlign: 'center',
        color: '#000000'
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
        width: 153,
        height: 81
    },
    listView: {
        paddingTop: 20,
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
    }
});

AppRegistry.registerComponent('ImageProject', () => ImageProject);
