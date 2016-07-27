import React, {
    Component,
} from 'react';

import Dimensions from 'Dimensions';

import {
    Image,
    Text,
    View,
    Navigator,
} from 'react-native';

var screenHeight = Dimensions.get('window').height;
var screenWidth = Dimensions.get('window').width;

class SplashPage extends Component {

    componentWillMount () {
        var navigator = this.props.navigator;
        setTimeout (() => {
            navigator.replace({
                id: 'mainView',
            });
        }, 2000);
    }
    render () {
        return (
            <View style={{flex: 1, backgroundColor: 'red', alignItems: 'center', justifyContent: 'center'}}>
                <Text
                  style={{fontSize: 36,color: '#fff', fontFamily: 'quicksand_bold', textAlign: 'center'}}>
                  Welcome to UnSplash!
                </Text>
            </View>
        );
    }
}

export default SplashPage;
