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
    Navigator,
    BackAndroid,
} from 'react-native';

import CuratedImg from './curated.js';
import Collection from './collections.js';
import Permissions from 'react-native-permissions';

import ScrollableTabView from 'react-native-scrollable-tab-view';
const deniedStatus = ['denied', 'restricted', 'undetermined'];

class MainView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            photoPermission: 'undetermined'
        }
    }

    componentDidMount() {
        Permissions.getPermissionStatus('photo')
            .then(response => {
                //response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
                this.setState({ photoPermission: response });
                if(deniedStatus.includes(response)){
                    this._alertForPhotosPermission()
                }
            });
    }

    //request permission to access photos
    _requestPermission() {
        Permissions.requestPermission('photo')
            .then(response => {
                //returns once the user has chosen to 'allow' or to 'not allow' access
                //response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
                this.setState({ photoPermission: response })
            });
    }

    //check the status of multiple permissions
    _checkCameraAndPhotos() {
        Permissions.checkMultiplePermissions(['camera', 'photo'])
            .then(response => {
                //response is an object mapping type to permission
                this.setState({
                    cameraPermission: response.camera,
                    photoPermission: response.photo,
                })
            });
    }

    _alertForPhotosPermission() {
        Alert.alert(
            'Can we access your photos?',
            'We need access so you can set your profile pic',
            [
                {text: 'No way', onPress: () => console.log('permission denied'), style: 'cancel'},
                this.state.photoPermission == 'undetermined'?
                    {text: 'OK', onPress: this._requestPermission.bind(this)}
                    : {text: 'Open Settings', onPress: Permissions.openSettings}
            ]
        )
    }

    render() {
        return (
            <ScrollableTabView
                tabBarUnderlineColor="red"
                tabBarPosition="bottom"
                tabBarTextStyle={{fontFamily: 'Quicksand-Regular', fontSize: 15}}
                style={styles.tabDisplay}>
                <CuratedImg tabLabel="Curated"/>
                <Collection tabLabel="Collections"/>
            </ScrollableTabView>
        );
    }
}

const styles = StyleSheet.create({
    tabDisplay: {
        marginBottom: -2,
    }
});

export default MainView;
