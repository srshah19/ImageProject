/**
 * Created by snehalwanda on 2/22/17.
 */
import {StyleSheet, Dimensions} from 'react-native';
import {Fonts, Colors} from '../Themes/';

// Extracting the device height and width
let {width} = Dimensions.get('window');

export default StyleSheet.create({
    button: {
        marginVertical: 5,
        borderTopColor: Colors.fire,
        borderBottomColor: Colors.bloodOrange,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        backgroundColor: Colors.ember
    },
    buttonText: {
        margin: 18,
        textAlign: 'center',
        color: Colors.snow,
        fontSize: Fonts.size.medium,
        fontFamily: Fonts.type.base
    },
    headerTitle: {
        color: Colors.snow,
        fontSize: Fonts.size.h5,
        fontFamily: Fonts.type.base,
        textAlign: 'center',
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
        margin: 10,
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'gray'
    },
    rightContainer: {
        flex: 1,
        marginTop: 10,
        flexDirection: 'column'
    },
    imageContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    genericText: {
        fontSize: Fonts.size.input,
        marginBottom: 3,
        textAlign: 'center',
        color: Colors.snow,
    },
    linkText: {
        fontWeight: 'normal',
        fontFamily: 'Quicksand-Bold',
        textDecorationStyle: 'solid',
        textDecorationLine: 'underline'
    },
    content: {
        fontSize: 14,
        textAlign: 'center',
        marginTop: 2,
        color: Colors.snow,
        fontFamily: 'Quicksand-Regular'
    },
    year: {
        textAlign: 'center'
    },
    modalText: {
        textAlign: "center",
        fontSize: 18,
        color: "#000",
        margin: 10,
    },
    thumbnail: {
        width: width / 1.25,
        height: 250,
        margin: 0
    },
    Quicksand: {
        fontFamily: "Quicksand-Regular"
    },
    listView: {
        paddingBottom: 10,
        marginBottom: 0,
        backgroundColor: '#000000'
    },
    overlay: {
        flex: 1,
        position: 'absolute',
        left: 0,
        top: 0,
        opacity: 0.5,
        backgroundColor: 'black',
        width: 300
    },
    toolbarDisplay: {
        backgroundColor: '#000',
        height: 50,
        margin: 0,
        padding: 0,
    },
    headerContainer: {
        flex: 1,
        flexDirection: 'column'
    },
    description: {
        fontSize: 14,
        textAlign: 'center',
        marginTop: 5,
        color: '#FFFFFF',
        fontFamily: 'Quicksand-Regular',
        flex: 0.5,
        flexDirection: 'column'
    },
    toolbar: {
        backgroundColor: Colors.coal,
        paddingTop: 20,
        paddingBottom: 20,
        flexDirection: 'row',
        borderBottomColor: 'grey',
        borderBottomWidth: 1,
    },
    toolbarTitle: {
        color: Colors.snow,
        textAlign: 'center',
        flex: 1,
        fontSize: 18,
        marginLeft: -15,
        fontFamily: 'Quicksand-Regular',
        justifyContent: 'center'
    },
    alignCenter: {
        textAlign: 'center'
    },
    mainContainer: {
        flex: 1
    },
    title: {
        fontSize: 16,
        marginBottom: 3,
        textAlign: 'center',
        color: '#FFFFFF',
        fontWeight: 'normal',
        fontFamily: 'Quicksand-Bold'
    },
    textContent: {
        fontSize: 14,
        textAlign: 'center',
        marginTop: 2,
        color: '#FFFFFF',
        fontFamily: 'Quicksand-Regular'
    },
    smallIcon: {
        width: 16,
        height: 16
    },
    toolbarBack: {
        width: 40,
        marginLeft: 10
    },
    halfContainer:{
        flex: 0.5
    },
    quarterContainer: {
        flex: 0.25
    },
    threeQuarterContainer: {
        flex: 0.75
    },
    portfolioDetail: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    profileImage: {
        width: 96,
        height: 96,
        borderRadius: 96/2,
        marginRight: 10,
        backgroundColor: 'transparent',
        marginTop: 25,
        marginLeft: 10
    },
    threeCol:{
        paddingTop:30,
        paddingBottom:10,
        flexDirection:'row'
    },
    centering: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
    }
})