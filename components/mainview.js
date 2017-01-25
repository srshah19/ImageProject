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
import HeartFloater from './heartstest.js';

import ScrollableTabView from 'react-native-scrollable-tab-view';

class MainView extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
          <ScrollableTabView
            tabBarUnderlineColor="red"
            tabBarPosition="bottom"
            tabBarTextStyle={{fontFamily: 'Quicksand-Regular', fontSize: 15}}
            style={styles.tabDisplay}>
            <CuratedImg tabLabel="Curated" />
            <Collection tabLabel="Collections" />
            <HeartFloater tabLabel="Hearts" />
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
