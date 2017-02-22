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
    ScrollView,
    Navigator,
    Dimensions,
    TouchableOpacity,
} from 'react-native';

import Modal from './modal.js';
import StoreImage from './Services/storeImage';

let cacheResults    = {
    data: {
        'results': [],
    }
};
let {height, width} = Dimensions.get('window');

// Shhh.. This is a secret Key! Keep this safe :D
const API_KEY = "79990a4b9b7eb74767c53ed17a039d2046a191f9a4fc33bd853ad272b7e4d199";

String.prototype.capitalizeFirstLetter = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

class Collections extends Component {
    constructor(props) {
        super(props);
        this.state       = {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2
            }),
            loaded: false,
            count: 1,
            refreshing: false,
            isLoadMore: false,
            modalOpen: false,
            headerText: this.props.data.col.title
        };
        this.REQUEST_URL = 'https://api.unsplash.com/collections/' + this.props.data.col.id + '/photos/?client_id=' + API_KEY + '&per_page=5';
    }

    componentDidMount() {
        NetInfo.isConnected.fetch().then(isConnected => {
            // Alert.alert('connected', 'connected', );
        });
        this.fetchData();
    }

    navBack() {
        this.props.navigator.pop();
    }

    requestURL(url = this.REQUEST_URL,
               count = this.state.count) {
        return (
            `${url}&page=${count}`
        );
    }

    saveImage() {
        let storeImage = new StoreImage();
        storeImage.download(this.state.imgInfo).then(() => {
            this.setState({modalOpen: false})
        });
    }

    fetchData() {
        fetch(this.requestURL())
            .then((response) => response.json())
            .then((responseData) => {
                if (!this.state.isLoadMore) {
                    cacheResults.data['results'] = [];
                }
                cacheResults.data['results'] = cacheResults.data['results'].concat(responseData);
                this.setState({
                    dataSource: this.getDataSource(cacheResults.data['results']),
                    loaded: true,
                    count: this.state.count + 1,
                    refreshing: false,
                    isLoadMore: true,
                });
            })
            .catch((error) => {
                Alert.alert('Network Error', error)
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
            isLoadMore: true,
        });
        this.fetchData();
    }

    navSingle(image) {
        this.props.navigator.push({
            id: 'single',
            data: {img: image}
        })
    }

    render() {
        return (
            <View style={styles.mainContainer}>
                <View style={styles.toolbar}>
                    <TouchableHighlight style={styles.toolbarBack} onPress={this.navBack.bind(this)}>
                        <Image
                            source={require('../assets/images/left-arrow.png')}
                            style={styles.smallIcon}/>
                    </TouchableHighlight>
                    <Text style={styles.toolbarTitle}>{this.state.headerText}</Text>
                </View>
                <View style={styles.content}>
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
                                onPress={this.saveImage.bind(this)}>
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
                    <Text style={styles.textContent}>Likes: {image.likes}</Text>
                </View>
            </View>
        );
    }
}

let styles = StyleSheet.create({
    mainContainer: {
        flex: 1
    },
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
    modalText: {
        textAlign: "center",
        fontSize: 18,
        color: "#000",
        margin: 10,
    },
    rightContainer: {
        flex: 1,
        marginTop: 10
    },
    toolbar: {
        backgroundColor: '#000',
        paddingTop: 30,
        paddingBottom: 10,
        flexDirection: 'row',
        borderBottomColor: 'grey',
        borderBottomWidth: 1,
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
        backgroundColor: '#ebeef0',
        flex: 1                //Step 2
    },
    toolbarTitle: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'normal',
        flex: 1,
        fontSize: 18,
        marginLeft: -10,
        fontFamily: 'Quicksand-Regular',
        justifyContent: 'center'
    },
    textContent: {
        fontSize: 14,
        textAlign: 'center',
        marginTop: 2,
        color: '#FFFFFF',
        fontFamily: 'Quicksand-Regular'
    },
    year: {
        textAlign: 'center'
    },
    thumbnail: {
        width: width / 1.25,
        height: 250,
        margin: 0
    },
    listView: {
        paddingBottom: 20,
        marginBottom: 0,
        backgroundColor: '#000000',
        flex: 1,
        flexDirection: 'column'
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
        padding: 0,
    },
    headerContainer: {
        flex: 1,
        flexDirection: 'column'
    },
    smallIcon: {
        width: 16,
        height: 16,
        marginLeft: 0,
        marginRight: 5,
    },
    toolbarBack: {
        width: 50,
    },
});

export default Collections;
