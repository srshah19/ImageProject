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
		CameraRoll,
} from 'react-native';


class SingleImage extends React.Component{

	navBack() {
		this.props.navigator.pop();
	}

	saveToCamera() {
		CameraRoll.saveToCameraRoll('https://images.unsplash.com/photo-1468476775582-6bede20f356f', function(data) {
      console.log(data);
    }, function(err) {
      console.log(err);
    });
	}

  render() {
    return (
			<View style={styles.mainContainer}>
				<View style={styles.toolbar}>
					<Text style={styles.toolbarButton} onPress={this.navBack.bind(this)}>Back</Text>
					<Text style={styles.toolbarTitle}>{this.props.data.img.user.username.capitalizeFirstLetter()}</Text>
					<Text style={styles.toolbarButton}>{this.props.data.img.likes} Likes</Text>
        </View>
				<View style={styles.content}>
					<TouchableHighlight style={styles.mainContainer}
							onPress={this.saveToCamera}
							activeOpacity={0.5}>
							<Image source={{uri: this.props.data.img.urls.regular}}
								style={styles.thumbnail}
								resizeMode="stretch" />
						</TouchableHighlight>
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
      backgroundColor: '#000000',
      margin: 0,
      padding: 0,
    },
		thumbnail: {
      width: 450,
      height: 250
    },
		toolbar:{
			backgroundColor: '#000000',
      paddingTop:30,
      paddingBottom:10,
      flexDirection:'row',
    },
    toolbarButton:{
      width: 50,
      color:'#fff',
      textAlign:'center',
			fontFamily: 'quicksand_regular'
    },
    toolbarTitle:{
        color:'#fff',
        textAlign:'center',
				fontWeight: 'normal',
        flex:1,
				fontFamily: 'quicksand_regular',
    },
		mainContainer:{
        flex:1
    },
    content:{
        backgroundColor:'#000000',
        flex:1,
    }
});

export default SingleImage;
