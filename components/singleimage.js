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
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    ToolbarAndroid,
    RefreshControl,
    ProgressBar,
    Navigator,
    CameraRoll,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    ToastAndroid,
    Platform,
} from 'react-native';

let {height, width} = Dimensions.get('window');
import Modal from './modal.js';
const RNFS = require('react-native-fs');

class SingleImage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            path: (Platform.OS === 'ios') ? RNFS.DocumentDirectoryPath + '/Unsplash' : RNFS.ExternalStorageDirectoryPath + '/Pictures/Unsplash',
            modalOpen: false,
        }
    }

    navBack() {
        this.props.navigator.pop();
    }

    testSaveImage() {
        let DownloadFileOptions = {
            fromUrl: this.state.imgInfo['urls']['full'],          // URL to download file from
            toFile: this.state.path + '/' + this.state.imgInfo['id'] + '.jpg',           // Local filesystem path to save the file to
            background: true,
        };
        let dirPath             = {
            path: this.state.path,
            that: this
        };
        RNFS.exists(dirPath['path']).then((res) => {
            if (res) {
                RNFS.downloadFile(DownloadFileOptions).promise.then((data) => {
                    dirPath['that'].setState({modalOpen: false});
                    ToastAndroid.show('Image successfully downloaded', ToastAndroid.LONG)
                });
            } else {
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

    render() {
        return (
            <View style={styles.mainContainer}>
                <TouchableHighlight
                    style={styles.container}
                    onLongPress={() => this.setState({modalOpen: true, imgInfo: this.props.data.img})}
                    delayLongPress={800}
                    activeOpacity={0.5}>
                    <Image
                        style={styles.backdrop}
                        source={{uri: this.props.data.img.urls.regular}}>
                        <View style={styles.backdropView}>
                            <Modal
                                offset={0}
                                open={this.state.modalOpen}
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
                            <View style={styles.toolbar}>
                                <TouchableHighlight onPress={this.navBack.bind(this)}>
                                    <Image
                                        source={require('../assets/images/left-arrow.png')}
                                        style={styles.smallIcon}/>
                                </TouchableHighlight>
                                <Text style={styles.toolbarBack} onPress={this.navBack.bind(this)}>Back</Text>
                            </View>
                            <Text style={styles.toolbar}>
                                <Text style={styles.toolbarTitle}
                                      onPress={() => Linking.openURL(this.props.data.img.user.portfolio_url)}>
                                    By: {this.props.data.img.user.name.capitalizeFirstLetter()}
                                </Text>
                                <Text style={styles.toolbarTitle}>
                                    {"\n"}
                                    {this.props.data.img.likes} Likes
                                </Text>
                            </Text>
                        </View>
                    </Image>
                </TouchableHighlight>
            </View>
        );
    }
}

let styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#000000',
        flexDirection: 'column'
    },
    toolbar: {
        backgroundColor: 'rgba(0,0,0,0.75)',
        flexDirection: 'row',
        padding: 20
    },
    toolbarBack: {
        color: '#FFF',
        flex: 1,
        fontSize: 16,
        fontFamily: 'Quicksand-Regular',
        margin: -2,
    },
    toolbarTitle: {
        color: '#fff',
        textAlign: 'left',
        fontWeight: 'normal',
        flex: 1,
        fontSize: 18,
        fontFamily: 'Quicksand-Regular',
        margin: 0,
        padding: 0
    },
    profileImage: {
        width: 64,
        borderRadius: 96,
        height: 64,
        marginRight: 10,
    },
    smallIcon: {
        width: 16,
        height: 16,
        marginLeft: 0,
        marginRight: 5,
    },
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#000000',
        width: width
    },
    backdrop: {
        width: width,
        height: height,
        opacity: 0.75
    },
    backdropView: {
        height: height,
        width: width,
        backgroundColor: 'rgba(0,0,0,0)',
    },
    headline: {
        fontSize: 20,
        textAlign: 'center',
        backgroundColor: '#FFF',
        color: 'black',
        position: 'absolute',
        top: height - 125,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        width: width
    },
    modalText: {
        textAlign: "center",
        fontSize: 18,
        color: "#000",
        margin: 10,
    }
});

export default SingleImage;
