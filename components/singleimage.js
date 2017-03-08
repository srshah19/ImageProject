/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, {Component} from 'react';

import {
    Image,
    Text,
    View,
    Navigator,
    TouchableOpacity,
    Platform,
    TouchableHighlight,
    Linking,
    Alert,
} from 'react-native';

import styles from './Styles/ImgList';
import {ApplicationStyles} from './Themes/';
import PhotoView from 'react-native-photo-view';

class SingleImage extends React.Component {

    constructor(props) {
        super(props);
    }

    navBack() {
        this.props.navigator.pop();
    }

    openAuthorLink(authorUrl) {
        authorUrl = authorUrl || '';
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
                <PhotoView
                    source={{uri: this.props.data.img['urls']['regular']}}
                    minimumZoomScale={1}
                    maximumZoomScale={4}
                    style={ApplicationStyles.screen.backgroundImage} />
                <View style={[styles.toolbar, {opacity: 0.7}]}>
                    <TouchableOpacity
                        style={styles.toolbarBack}
                        onPress={this.navBack.bind(this)}>
                        <Image
                            source={require('../assets/images/left-arrow.png')}
                            style={styles.smallIcon}/>
                    </TouchableOpacity>
                </View>
                <View style={styles.threeQuarterContainer}>
                </View>
                <View style={[styles.quarterContainer, {backgroundColor: 'rgba(0, 0, 0, 0.75)'}]}>
                    <View style={styles.portfolioDetail}>
                        <TouchableOpacity
                            onPress={this.openAuthorLink.bind(this, this.props.data.img.user['portfolio_url'])}>
                            <Image
                                source={{uri: this.props.data.img.user['profile_image'].medium}}
                                resizeMode='contain'
                                style={[styles.profileImage, {justifyContent: 'center'}]}/>
                        </TouchableOpacity>
                        <View style={[styles.halfContainer, {justifyContent: 'center'}]}>
                            <Text>
                                <Text style={[styles.content, styles.genericText]}>
                                    By: {this.props.data.img.user['name'].capitalizeFirstLetter()}
                                </Text>
                                <Text style={[styles.content, styles.genericText]}>
                                    {"\n"}
                                    {this.props.data.img['likes']} Likes
                                </Text>
                                <Text style={[styles.genericText, styles.content]}>
                                    {"\n"}
                                    Total Collections: {this.props.data.img.user['total_collections']}
                                </Text>
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}

export default SingleImage;
