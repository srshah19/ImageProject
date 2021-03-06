/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, {Component} from 'react';
import {
    Alert,
    Image,
    ListView,
    Text,
    View,
    TouchableHighlight,
    RefreshControl,
    NetInfo,
    Navigator,
    BackAndroid,
    ActivityIndicator,
} from 'react-native';


/**
 * Import all application specific components here
 */
import CollectionsList from './collectionlist.js';
import CuratedSingleImg from './singleimage.js';
import styles from './Styles/ImgList';
import {ApplicationStyles} from './Themes/';
import * as Config from './Services/Configuration';
import PhotoView from 'react-native-photo-view';

let cacheResults = {
    data: {
        'results': [],
    }
};

let _navigatorCollections; // we fill this up upon on first navigation.

BackAndroid.addEventListener('hardwareBackPress', () => {
    if (_navigatorCollections) {
        if (_navigatorCollections.getCurrentRoutes().length === 1) {
            return false;
        }
        _navigatorCollections.pop();
        return true;
    }
});

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
            animating: false,
            count: 1,
            refreshing: false,
            api_key: Config.getConfiguration('APP_ID')
        };
        this.REQUEST_URL = 'https://api.unsplash.com/collections/featured/?client_id=' + this.state.api_key + '&per_page=5';
    }

    componentDidMount() {
        this.fetchData();
    }

    requestURL(url = this.REQUEST_URL,
               count = this.state.count) {
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
                    animating: false,
                    count: this.state.count + 1,
                    refreshing: false,
                });
            })
            .catch((error) => {
                Alert.alert('Network Error', error.message)
            })
            .done();
    }

    getDataSource(responseData): ListView.DataSource {
        return this.state.dataSource.cloneWithRows(responseData)
    }

    loadMore() {
        this.setState({
            animating: true,
            refreshing: true,
        });
        this.fetchData();
    }

    navCollectionList(collection) {
        this.props.navigator.push({
            id: 'collectionslist',
            data: {col: collection}
        })
    }

    render() {
        return (
            <View style={ApplicationStyles.screen.container}>
                <View style={styles.toolbar}>
                    <Text style={[styles.headerTitle, styles.toolbarTitle]}>Collections</Text>
                </View>
                <ListView
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this.loadMore.bind(this)}
                        />
                    }
                    dataSource={this.state.dataSource}
                    renderRow={this.renderCollection.bind(this)}
                    style={styles.listView}
                    onEndReachedThreshold={10}
                    onEndReached={this.loadMore.bind(this)}>
                </ListView>
                <ActivityIndicator
                    animating={this.state.animating}
                    color="#900"
                    style={[ApplicationStyles.screen.backgroundSpinner, {height: 120}]}
                    size="large"
                />
            </View>
        );
    }

    renderCollection(collection) {
        return (
            <View style={styles.container}>
                <PhotoView
                    source={{uri: collection['cover_photo']['urls'].regular}}
                    minimumZoomScale={1}
                    maximumZoomScale={4}
                    onTap={this.navCollectionList.bind(this, collection)}
                    style={styles.thumbnail}/>
                <View style={styles.rightContainer}>
                    <Text style={styles.title}>{collection.title.capitalizeFirstLetter()}</Text>
                    <Text style={styles.description}>{(collection.description) ? collection.description : 'N/A'}</Text>
                </View>
            </View>
        );
    }
}

class InitialCollections extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Navigator
                initialRoute={{id: 'collections'}}
                renderScene={this.navigatorRenderScene}/>
        );
    }

    navigatorRenderScene(route, navigator) {
        _navigatorCollections = navigator;
        switch (route.id) {
            case 'collections':
                return (<Collections navigator={navigator}/>);
            case 'collectionslist':
                return (<CollectionsList navigator={navigator} data={route.data}/>);
            case 'single':
                return (<CuratedSingleImg navigator={navigator} data={route.data}/>);
        }
    }
}

export default InitialCollections;
