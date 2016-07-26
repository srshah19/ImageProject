/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, {
    Component,
} from 'react';

import Firebase from 'firebase';

// Spinner to show Loading
import Spinner from 'react-native-loading-spinner-overlay';

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

import CuratedImg from './components/curated.js';
import Collection from './components/collections.js';

var cacheResults = {
  data: {
    'results': [],
  }
}

var ScrollableTabView = require('react-native-scrollable-tab-view');

class ImageProject extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
          <ScrollableTabView
            tabBarUnderlineColor="red"
            tabBarTextStyle={{fontFamily: 'quicksand_regular', fontSize: 15}}
            style={styles.tabDisplay}>
            <CuratedImg tabLabel="Curated" />
            <Collection tabLabel="Collections" />
          </ScrollableTabView>
        );
    }
}

var styles = StyleSheet.create({
  tabDisplay: {
    marginBottom: 0,
  }
})
AppRegistry.registerComponent('ImageProject', () => ImageProject);
