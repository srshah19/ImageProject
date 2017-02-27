/**
 * Created by snehalwanda on 2/17/17.
 */

import {
    Platform,
    CameraRoll,
    ToastAndroid,
    Alert,
} from 'react-native';

import FileStorage from 'react-native-fs';

class StoreImage {
    constructor() {
        this.state = {
            path: (Platform.OS === 'android') ? FileStorage.PicturesDirectoryPath + '/AwesomeSnap' : FileStorage.CachesDirectoryPath,
        }
    }

    download(imgObj) {
        let DownloadFileOptions = {
            fromUrl: imgObj['urls']['full'],          // URL to download file from
            toFile: this.state.path + '/' + imgObj['id'] + '.jpg',           // Local filesystem path to save the file to
            background: true,
        };
        let dirPath             = {
            path: this.state.path,
            that: this
        };
        return new Promise(function(resolve, reject) {
            FileStorage.exists(dirPath['path']).then((res) => {
                if (res) {
                    FileStorage.downloadFile(DownloadFileOptions).promise.then((data) => {
                        if(Platform.OS === 'ios'){
                            let cacheImagePath = DownloadFileOptions.toFile;
                            let promise = CameraRoll.saveToCameraRoll(cacheImagePath, 'photo');
                            promise.then(function(result) {
                                resolve(result);
                                Alert.alert('Image saved to Library', 'Go check it out :)');
                            }).catch(function(error) {
                                reject(error);
                            });
                        } else {
                            Alert.alert('Image saved to Library', 'Go check it out :)');
                            resolve();
                        }
                    });
                } else {
                    FileStorage.mkdir(dirPath['path'])
                        .then(() => {
                            FileStorage.downloadFile(DownloadFileOptions).promise.then(() => {
                                Alert.alert('Image saved to Library', 'Go check it out!');
                                resolve();
                            });
                        })
                }
            }).catch(() => {
                Alert.alert('Could not download image', 'Please try later.');
                reject();
            });
        })
    }
}

export default StoreImage;