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
} from 'react-native';


const RNFS = require('react-native-fs');

class SingleImage extends React.Component{

  navBack() {
    this.props.navigator.pop();
  }

  saveToCamera() {
      fetch('https://images.unsplash.com/photo-1468476775582-6bede20f356f').then((resp) => {
        RNFS.readFile(RNFS.CachesDirectoryPath+'/org.reactjs.native.example.Unsplash/fsCachedData/03AA51BA-64C9-4C5A-B0DE-9D9348B61DE1', 'base64').then((data) => {
            CameraRoll.saveToCameraRoll(data, 'photo').then((data)=> {
              console.log(data);
            })
        })
      });
  }

  render() {
    return (
      <ScrollView style={styles.mainContainer}>
      <View style={styles.container}>
          <View style={styles.toolbar}>
            <TouchableHighlight onPress={this.navBack.bind(this)}>
              <Image
                source={require('../assets/images/left-arrow.png')}
                style={styles.smallIcon} />
            </TouchableHighlight>
            <Text style={styles.toolbarBack} onPress={this.navBack.bind(this)}>Back</Text>
          </View>
          <View style={styles.threeQuarterContainer}>
            <TouchableHighlight style={styles.imageContainer}
                onPress={this.saveToCamera}
                activeOpacity={0.5}>
                <Image source={{uri: this.props.data.img.urls.regular}}
                  style={styles.thumbnail}
                  resizeMode='contain' />
              </TouchableHighlight>
          </View>
          <View style={styles.quarterContainer}>
            <View style={styles.portfolioDetail}>
              <Image
                source={{uri: this.props.data.img.user.profile_image.medium}}
                style={styles.profileImage} />
                <View style={styles.halfContainer}>
                  <Text>
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
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }
}

let styles = StyleSheet.create({
  mainContainer:{
      flex: 1,
      backgroundColor: '#000000',
      flexDirection: 'column'
  },
    container: {
      marginRight: 10,
      marginLeft: 10,
      marginTop: 0,
      marginBottom: 5,
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
      margin: 10
    },
    toolbarBack: {
      color: '#FFF',
      flex: 0.5,
      fontSize: 16,
      fontFamily: 'Quicksand-Regular',
        margin: -5,
    },
    toolbarTitle:{
      color:'#fff',
      textAlign:'left',
      fontWeight: 'normal',
      flex: 1,
      fontSize: 18,
      fontFamily: 'Quicksand-Regular',
      margin: 0,
      padding: 0
    },
    imageContainer: {
      flex: 1,
      alignItems: 'center',
    },
    profileImage: {
      width: 64,
      borderRadius: 96,
      height: 64,
      marginRight: 10,
    },
    halfContainer:{
      flex: 0.5,
      margin: 10
    },
    quarterContainer: {
      flex: 0.25
    },
    threeQuarterContainer: {
      flex: 0.75,
      marginBottom: 10,
    },
    portfolioDetail: {
      flex: 1,
      flexDirection: 'row'
    },
    smallIcon: {
      width: 16,
      height: 16,
      marginLeft: 0,
      marginRight: 5,
    }
});

export default SingleImage;
