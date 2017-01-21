/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, {
    Component,
} from 'react';

import Firebase from 'firebase';

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

import MainView from './components/mainview.js';
import SplashPage from './components/splashscreen.js';

class ImageProject extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Navigator
                initialRoute={{id: 'splash'}}
                renderScene={this.navigatorRenderScene}/>
        );
    }

    navigatorRenderScene(route, navigator) {
        _navigator = navigator;
        switch (route.id) {
            case 'splash':
                return(<SplashPage navigator={navigator} />);
            case 'mainView':
                return (<MainView navigator={navigator} />);
        }
    }
}

AppRegistry.registerComponent('ImageProject', () => ImageProject);
