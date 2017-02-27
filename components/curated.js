/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, {Component} from 'react';

import {
    Alert,
    Image,
    ListView,
    Linking,
    Text,
    View,
    TouchableHighlight,
    ToolbarAndroid,
    RefreshControl,
    Navigator,
    BackAndroid,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';

/**
 * Import all application specific components here
 */
import CuratedSingleImg from './singleimage.js';
import StoreImage from './Services/StoreImage';
import styles from './Styles/ImgList';
import {ApplicationStyles} from './Themes/';
import * as Config from './Services/Configuration';
import PhotoView from 'react-native-photo-view';
import Icon from 'react-native-vector-icons/FontAwesome';

let cacheResults = {
    data: {
        'results': [],
    }
};

let _navigator; // we fill this up upon on first navigation.

BackAndroid.addEventListener('hardwareBackPress', () => {
    if (_navigator.getCurrentRoutes().length === 1) {
        return false;
    }
    _navigator.pop();
    return true;
});

String.prototype.capitalizeFirstLetter = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

class CuratedImg extends Component {
    constructor(props) {
        super(props);
        this.state       = {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2
            }),
            animating: false,
            count: 1,
            refreshing: false,
            modalOpen: false,
            api_key: Config.getConfiguration('APP_ID')
        };
        this.REQUEST_URL = 'https://api.unsplash.com/photos/curated/?client_id=' + this.state.api_key + '&per_page=5';
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
        this.setState({animating: true});
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
                Alert.alert('Network Error', 'API request has maxed out. Try again in the next hour.')
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

    openAuthorLink(img) {
        let authorUrl = img.user['portfolio_url'] || false;
        Linking.canOpenURL(authorUrl).then(supported => {
            if (supported) {
                Linking.openURL(authorUrl);
            } else {
                Alert.alert('Error Occurred', 'Sorry we could not open the user profile.')
            }
        });
    }

    saveImage(image) {
        this.setState({
            animating: true
        });
        let storeImage = new StoreImage();
        storeImage.download(image).then(() => {
            this.setState({animating: false});
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
            <View style={ApplicationStyles.screen.container}>
                <View style={styles.toolbar}>
                    <Text style={[styles.headerTitle, styles.toolbarTitle]}>Curated Images</Text>
                </View>
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
                <ActivityIndicator
                    animating={this.state.animating}
                    color="#900"
                    style={[ApplicationStyles.screen.backgroundSpinner, {height: 120}]}
                    size="large"
                />
            </View>
        );
    }

    renderMovie(image) {
        return (
                <View style={styles.container}>
                    <PhotoView
                        source={{uri: image['urls']['regular']}}
                        minimumZoomScale={1}
                        maximumZoomScale={4}
                        androidScaleType="center"
                        onTap={this.navSingle.bind(this, image)}
                        style={styles.thumbnail}/>
                    <View style={styles.threeCol}>
                        <Text style={[styles.content, styles.quarterContainer, {alignItems: 'flex-start', marginLeft: -10}]}>
                            <Icon name="heart" size={18} color="#900" /> {image['likes']}
                        </Text>
                        <TouchableOpacity
                            style={styles.halfContainer}
                            onPress={this.openAuthorLink.bind(this, image)}>
                            <Text
                                style={[styles.linkText, styles.genericText]}>
                                {image.user['username'].capitalizeFirstLetter()}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.quarterContainer, {alignItems: 'flex-end'}]}
                            onPress={this.saveImage.bind(this, image)}>
                            <Icon name="download" size={20} color="#FFF" />
                        </TouchableOpacity>
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
                return (<CuratedImg navigator={navigator}/>);
            case 'single':
                return (<CuratedSingleImg navigator={navigator} data={route.data}/>);
        }
    }
}

export default InitialCurated;
