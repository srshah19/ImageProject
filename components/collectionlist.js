/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, {
    Component,
} from 'react';

import {
    Alert,
    Image,
    ListView,
    Linking,
    Text,
    View,
    TouchableHighlight,
    RefreshControl,
    NetInfo,
    ScrollView,
    Navigator,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';

/**
 * Import all application specific components here
 */
import PhotoView from 'react-native-photo-view';
import StoreImage from './Services/StoreImage';
import styles from './Styles/ImgList';
import {ApplicationStyles} from './Themes/';
import * as Config from './Services/Configuration';
import Icon from 'react-native-vector-icons/FontAwesome';
import Share, {ShareSheet, Button} from 'react-native-share';

let cacheResults    = {
    data: {
        'results': [],
    }
};

String.prototype.capitalizeFirstLetter = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

class Collections extends Component {
    constructor(props) {
        super(props);
        this.state       = {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1.id !== row2.id
            }),
            animating: false,
            count: 1,
            refreshing: false,
            isLoadMore: false,
            modalOpen: false,
            headerText: this.props.data.col.title,
            api_key: Config.getConfiguration('APP_ID')
        };
        this.REQUEST_URL = 'https://api.unsplash.com/collections/' + this.props.data.col.id + '/photos/?client_id=' + this.state.api_key + '&per_page=5';
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

    shareImage(image){
        let shareOptions = {
            title: "Check out this image from Unsplash.com!",
            message: "Shared via AwesomeSnap",
            url: image.links['html'],
            subject: "Check out this image. Shared via AwesomeSnap." //  for email
        };
        Share.open(shareOptions).then((data) => {
            console.log(data)
        }).catch((err) => {
            err && console.log(err);
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
                    animating: false,
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
            animating: true,
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

    openAuthorLink(img) {
        let authorUrl = img.user['portfolio_url'] || ' ';
        Linking.canOpenURL(authorUrl).then(supported => {
            if (supported) {
                Linking.openURL(authorUrl);
            } else {
                Alert.alert('Error Occurred', 'Sorry we could not open the user profile.')
            }
        });
    }

    render() {
        return (
            <View style={ApplicationStyles.screen.container}>
                <View style={styles.toolbar}>
                    <TouchableHighlight
                        style={styles.toolbarBack}
                        onPress={this.navBack.bind(this)}
                        activeOpacity={0}>
                        <Image
                            source={require('../assets/images/left-arrow.png')}
                            style={styles.smallIcon}/>
                    </TouchableHighlight>
                    <Text style={[styles.headerTitle, styles.toolbarTitle]}>{this.state.headerText}</Text>
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
                    onTap={this.navSingle.bind(this, image)}
                    style={styles.thumbnail}/>
                <View style={styles.threeCol}>
                    <Text style={[styles.content, styles.quarterContainer, {alignItems: 'flex-start'}]}>
                        <Icon name="heart" size={30} color="#900" /> {image['likes']}
                    </Text>
                    <TouchableOpacity
                        style={styles.quarterContainer}
                        onPress={this.openAuthorLink.bind(this, image)}>
                        <Text
                            style={[styles.linkText, styles.genericText]}>
                            {image.user['username'].capitalizeFirstLetter()}
                        </Text>
                    </TouchableOpacity>
                    <View style={[styles.quarterContainer, {alignItems: 'flex-end'}]}>
                        <TouchableOpacity
                            onPress={this.shareImage.bind(this, image)}>
                            <Icon name="share-alt-square" size={30} color="#FFF" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}

export default Collections;
