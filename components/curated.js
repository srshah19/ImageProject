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
    Navigator,
    BackAndroid,
    windowSize,
    TouchableOpacity,
    ToastAndroid,
    Dimensions,
} from 'react-native';

import CuratedSingleImg from './singleimage.js';
import Modal from './modal.js';
const RNFS = require('react-native-fs');

/* RNFS options: [PicturesDirectoryPath,CachesDirectoryPath,DocumentDirectoryPath  ]*/

let cacheResults = {
  data: {
    'results': [],
  }
};

let _navigator; // we fill this up upon on first navigation.
let {height, width} = Dimensions.get('window');

BackAndroid.addEventListener('hardwareBackPress', () => {
  if (_navigator.getCurrentRoutes().length === 1  ) {
     return false;
  }
  _navigator.pop();
  return true;
});

// Shhh.. This is a secret Key! Keep this safe :D
const API_KEY = "79990a4b9b7eb74767c53ed17a039d2046a191f9a4fc33bd853ad272b7e4d199";

String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

class CuratedImg extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2
            }),
            loaded: false,
            count: 1,
            refreshing: false,
            path: RNFS.ExternalStorageDirectoryPath+'/Pictures/Unsplash',
            modalOpen: false,
        };
        this.REQUEST_URL = 'https://api.unsplash.com/photos/curated/?client_id='+API_KEY+'&per_page=5';
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
                    refreshing: false,
                });
            })
            .catch((error) => {
              Alert.alert('Network Error', 'API request has maxed out. Try again in the next hour.')
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
        });
        this.fetchData();
    }

    testSaveImage(){
        let DownloadFileOptions = {
            fromUrl: this.state.imgInfo['urls']['full'],          // URL to download file from
            toFile: this.state.path+'/'+this.state.imgInfo['id']+'.jpg',           // Local filesystem path to save the file to
            background: true,
        };
        let dirPath = {
            path: this.state.path,
            that: this
        };
        RNFS.exists(dirPath['path']).then((res) => {
            if(res){
                RNFS.downloadFile(DownloadFileOptions).promise.then((data) => {
                    console.log(data);
                    dirPath['that'].setState({modalOpen: false});
                    ToastAndroid.show('Image successfully downloaded', ToastAndroid.LONG)
                });
            } else{
                RNFS.mkdir(dirPath['path'])
                    .then(() => {
                        RNFS.downloadFile(DownloadFileOptions).promise.then((data) => {
                            dirPath['that'].setState({modalOpen: false});
                            ToastAndroid.show('Image successfully downloaded', ToastAndroid.LONG)
                        });
                    })
            }
        }).catch(() => {
            this.setState({modalOpen: false});
            ToastAndroid.show('Image downloaded unsuccessful. Please close app and try again.', ToastAndroid.LONG)
        });
    }

    navSingle(image) {
      this.props.navigator.push({
        id: 'single',
        data: {img: image}
      })
    }

    render() {
        return (
            <View style={{paddingTop: 20, backgroundColor: '#000'}}>
                <Text style={styles.title}>Curated View</Text>
                <ListView
                    refreshControl={
                      <RefreshControl
                          refreshing={this.state.refreshing}
                          onRefresh={this.loadMore.bind(this)}
                      />
                    }
                    dataSource={this.state.dataSource}
                    renderRow={this.renderMovie.bind(this)}
                    style={styles.listView}
                    onEndReachedThreshold={10}
                    onEndReached={this.loadMore.bind(this)}>
                </ListView>
                <Modal
                    offset={0}
                    open={this.state.modalOpen}
                    modalDidOpen={() => console.log('modal did open')}
                    modalDidClose={() => this.setState({modalOpen: false})}
                    style={{alignItems: 'center'}}>
                    <View>
                        <TouchableOpacity
                            style={{margin: 5}}
                            onPress={this.testSaveImage.bind(this)}>
                            <Text style={styles.modalText}>Save Image</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{margin: 5}}
                            onPress={() => this.setState({modalOpen: false})}>
                            <Text style={styles.modalText}>Close modal</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
            </View>
        );
    }

    renderMovie(image) {
        return (
            <View style={styles.container}>
                <TouchableHighlight style={styles.imageContainer}
                    onPress={this.navSingle.bind(this, image)}
                    onLongPress={() => this.setState({modalOpen: true, imgInfo: image})}
                    delayLongPress={800}
                    activeOpacity={0.5}>
                    <Image
                      resizeMode='contain'
                      source={{uri: image.urls.regular}}
                      style={styles.thumbnail}
                    />
                </TouchableHighlight>
                <View style={styles.rightContainer}>
                    <Text style={styles.title}>{image.user.username.capitalizeFirstLetter()}</Text>
                    <Text style={styles.content}>Likes: {image.likes}</Text>
                </View>
            </View>
        );
    }
}

class InitialCurated extends Component {
    render() {
        return (
          <Navigator
            initialRoute={{id: 'curated'}}
            renderScene={this.navigatorRenderScene}/>
        );
      }

      navigatorRenderScene(route, navigator) {
        _navigator = navigator;
        switch (route.id) {
          case 'curated':
            return (<CuratedImg navigator={navigator} />);
          case 'single':
            return (<CuratedSingleImg navigator={navigator} data={route.data} />);
        }
      }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#000',
      margin: 10,
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: 'gray'
    },
    rightContainer: {
      flex: 1,
      marginTop: 10
    },
    imageContainer: {
      flex: 1,
      justifyContent: 'center',
  },
    title: {
      fontSize: 16,
      marginBottom: 3,
      textAlign: 'center',
      color: '#FFFFFF',
      fontWeight: 'normal',
      fontFamily: 'Quicksand-Bold'
    },
    content: {
      fontSize: 14,
      textAlign: 'center',
      marginTop: 2,
      color: '#FFFFFF',
      fontFamily: 'Quicksand-Regular'
    },
    year: {
       textAlign: 'center'
    },
    modalText:{
        textAlign: "center",
        fontSize: 18,
        color: "#000",
        margin: 10,
    },
    thumbnail: {
        width: width/1.25,
        height: 250,
        margin: 0
    },
    Quicksand:{
        fontFamily: "Quicksand-Regular"
    },
    listView: {
      paddingBottom: 20,
      marginBottom: 0,
      backgroundColor: '#000000'
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
      backgroundColor: '#000',
      height: 50,
      margin: 0,
      padding: 0,
    },
    headerContainer: {
      flex: 1,
      flexDirection: 'column'
    },
});

export default InitialCurated;
