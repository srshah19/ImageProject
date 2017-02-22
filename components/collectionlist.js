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
} from 'react-native';

/**
 * Import all application specific components here
 */
import Modal from './modal.js';
import StoreImage from './Services/StoreImage';
import styles from './Styles/ImgList';
import {ApplicationStyles} from './Themes/';
import * as Config from './Services/Configuration';

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
                rowHasChanged: (row1, row2) => row1 !== row2
            }),
            loaded: false,
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
                    <Text style={styles.textContent}>Likes: {image.likes}</Text>
                </View>
            </View>
        );
    }
}

export default Collections;
