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
} from 'react-native';

/**
 * Import all application specific components here
 */
import CuratedSingleImg from './singleimage.js';
import Modal from './modal.js';
import StoreImage from './Services/StoreImage';
import styles from './Styles/ImgList';
import {ApplicationStyles} from './Themes/';
import * as Config from './Services/Configuration';

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
            loaded: false,
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

    saveImage() {
        let storeImage = new StoreImage();
        storeImage.download(this.state.imgInfo).then(() => {
            this.setState({modalOpen: false})
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
                    <TouchableOpacity
                        onPress={this.openAuthorLink.bind(this, image)}>
                        <Text style={[styles.linkText, styles.genericText]}>{image.user.username.capitalizeFirstLetter()}</Text>
                    </TouchableOpacity>
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
                return (<CuratedImg navigator={navigator}/>);
            case 'single':
                return (<CuratedSingleImg navigator={navigator} data={route.data}/>);
        }
    }
}

export default InitialCurated;
