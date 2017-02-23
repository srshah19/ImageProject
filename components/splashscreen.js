import React, {
    Component,
} from 'react';

import {
    Image,
    Text,
    View,
    Navigator,
} from 'react-native';


import * as Config from './Services/Configuration';

class SplashPage extends Component {

    componentWillMount () {
        let navigator = this.props.navigator;
        setTimeout (() => {
            navigator.replace({
                id: 'mainView',
            });
        }, 2000);
    }

    componentDidMount() {
        Config.setConfiguration('APP_ID', "11245ab7eadd86ff0b3a6d132ddfd7ec0fdc6b835812f14edb38c7813b483013");
    }
    render () {
        return (
            <View style={{flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center'}}>
                <Text
                  style={{fontSize: 36,color: '#fff', fontFamily: 'Quicksand-Bold', textAlign: 'center'}}>
                  Welcome!
                    {"\n"}
                </Text>
                <Text style={{fontSize: 16,color: '#fff', fontFamily: 'Quicksand-Bold', textAlign: 'center'}}>
                    (Credits: Unsplash)
                </Text>
            </View>
        );
    }
}

export default SplashPage;
