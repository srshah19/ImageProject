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
} from 'react-native';


class SingleImage extends React.Component{
  render() {
    return (
			<View style={styles.mainContainer}>
				<View style={styles.toolbar}>
					<Text style={styles.toolbarButton}>{this.props.data.img.user.username}</Text>
					<Text style={styles.toolbarTitle}>This is the title</Text>
					<Text style={styles.toolbarButton}>Like</Text>
        </View>
				<View style={styles.content}>
					<Image source={{uri: this.props.data.img.urls.regular}}
							style={styles.thumbnail}
							resizeMode="stretch" />
        </View>
      </View>
    );
  }
}

var styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'transparent',
      margin: 0,
      padding: 0,
    },
		thumbnail: {
      width: 450,
      height: 250
    },
		toolbar:{
        backgroundColor:'#81c04d',
        paddingTop:30,
        paddingBottom:10,
        flexDirection:'row'
    },
    toolbarButton:{
        width: 50,
        color:'#fff',
        textAlign:'center'
    },
    toolbarTitle:{
        color:'#fff',
        textAlign:'center',
        fontWeight:'bold',
        flex:1,
    },
		mainContainer:{
        flex:1
    },
    content:{
        backgroundColor:'#ebeef0',
        flex:1
    }
});

export default SingleImage;
