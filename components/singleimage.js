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

class SingleImage extends React.Component {

    constructor(props) {
        super(props);
    }

    navBack() {
        this.props.navigator.pop();
    }

    openAuthorLink(authorUrl) {
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
                <Image
                    style={ApplicationStyles.screen.backgroundImage}
                    source={{uri: this.props.data.img['urls']['regular']}} />
                <View style={[styles.toolbar, {opacity: 0.7}]}>
                    <TouchableHighlight
                        style={styles.toolbarBack}
                        onPress={this.navBack.bind(this)}
                        activeOpacity={0}>
                        <Image
                            source={require('../assets/images/left-arrow.png')}
                            style={styles.smallIcon}/>
                    </TouchableHighlight>
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
                                <Text style={styles.genericText}>
                                    By: {this.props.data.img.user['name'].capitalizeFirstLetter()}
                                </Text>
                                <Text style={styles.genericText}>
                                    {"\n"}
                                    {this.props.data.img['likes']} Likes
                                </Text>
                                <Text style={styles.genericText}>
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
