import * as React from 'react'
import { useEffect, useState, useRef } from 'react'
import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Button,
  SafeAreaView
} from 'react-native'
import * as tf from '@tensorflow/tfjs'
import '@tensorflow/tfjs-react-native'
import * as mobilenet from '@tensorflow-models/mobilenet'
import { decodeJpeg } from '@tensorflow/tfjs-react-native'
import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'
import { Camera, CameraType } from 'expo-camera'
import { shareAsync } from 'expo-sharing'
import { StatusBar } from 'expo-status-bar'
import { log } from '@tensorflow/tfjs'

export default function TakePicture({ navigation }) {
  //tensorflow
  const [isTfReady, setIsTfReady] = useState(false)
  const [mobilenetModel, setMobilenetModel] = useState(null)
  // const [image, setImage] = useState()
  const [predictions, setPredictions] = useState(null)

  // camera
  let cameraRef = useRef()
  const [hasCameraPermission, setHasCameraPermission] = useState()
  const [photo, setPhoto] = useState()
  const [selectedImage, setSelectedImage] = React.useState(null)
  // const [type, setType] = useState(CameraType.back);

  useEffect(() => {
    ;(async function getTensor() {
      await tf.setBackend('cpu')
      await tf.ready()
      setIsTfReady(true)
      try {
        let myModel = await mobilenet.load()
        setMobilenetModel(myModel)
      } catch (err) {
        console.log(err)
      }
    })()
  }, [])

  // if (hasCameraPermission === undefined) {
  //   return <Text>Requesting permissions...</Text>
  // } else if (!hasCameraPermission) {
  //   return (
  //     <Text>
  //       Permission for camera not granted. Please change this in settings.
  //     </Text>
  //   )
  // }

  // const YourComponent = ({ img }) => {
  //   const myImage = React.createElement(
  //     'img',
  //     {
  //       src: photo.uri,
  //       // any other image attributes you need go here
  //     },
  //     null,
  //   )

  //   setPhoto(myImage);
  // }

  // const myClick = async () => {
  //   const img = document.getElementById('img1')
  //   console.log(img)
  //   // console.log(Image.getSize("./dog.jpg"), "success", [failure]);
  //   console.log('hello')
  //   mobilenet.load().then((model) => {
  //     console.log(model)
  //     model.classify('./dog.jpg').then((predictions) => {
  //       console.log('Predictions:', predictions)
  //     })
  //   })
  // }

  // === CLEAR PREDICTIONS ==

  const clearPredictions = () => {
    setPredictions(null)
  }

  // convert image to tensor
  const imageToTensor = (rawImageData) => {
    const TO_UINT8ARRAY = true
    const { width, height, data } = jpeg.decode(rawImageData, TO_UINT8ARRAY)
    // Drop the alpha channel info for mobilenet
    const buffer = new Uint8Array(width * height * 3)
    let offset = 0 // offset into original data
    for (let i = 0; i < buffer.length; i += 3) {
      buffer[i] = data[offset]
      buffer[i + 1] = data[offset + 1]
      buffer[i + 2] = data[offset + 2]
      offset += 4
    }
    return tf.tensor3d(buffer, [height, width, 3])
  }

  const openImagePickerAsync = async () => {
   //document.getElementById("takephoto").enabled =false;
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!')
      return
    }
    let pickerResult = await ImagePicker.launchImageLibraryAsync()
    if (pickerResult.cancelled === true) {
      return
    }
    setSelectedImage({ localUri: pickerResult.uri })
  }
  if (selectedImage !== null) {
    return (
      <View style={styles.container}>
        <Image
          source={{ uri: selectedImage.localUri }}
          style={styles.thumbnail}
        />
        <TouchableOpacity  style={styles.buttonStyle} onPress={openImagePickerAsync}><Text>Upload again</Text></TouchableOpacity>
        <View>
          <TouchableOpacity style={styles.buttonStyle} onPress={imageToTensor(selectedImage)}><Text>Predict</Text></TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.buttonStyle} onPress={() => navigation.navigate('Home')}>
        <Text>Back</Text>
      </TouchableOpacity>
      </View>
    );
  }
    
  const takePic = async () => {
    let options = {
      quality: 1,
      base64: true,
      exif: false
    };

    let newPhoto = await cameraRef.current.takePictureAsync(options);
    setPhoto(newPhoto);
  };

  if (photo) {
    // console.log(`data:image/jpg;base64,${photo.base64}`)
    let sharePic = () => {
      shareAsync(photo.uri).then(() => {
        setPhoto(undefined);
      });
    };

    const savePhoto = () => {
      console.log('save');

    };

    return (
      <SafeAreaView style={styles.container}>
        {/* erro in chrome , in ios and android works */}
        <Image style={styles.preview} source={{uri: `data:image/jpg;base64,${photo.base64}`}} /> 
        <TouchableOpacity style={styles.buttonStyle} onPress={savePhoto}><Text>Save</Text></TouchableOpacity>
        <TouchableOpacity style={styles.buttonStyle} onPress={sharePic}><Text>Share</Text></TouchableOpacity>
        <TouchableOpacity style={styles.buttonStyle} onPress={() => setPhoto(undefined)}><Text>Discard</Text></TouchableOpacity>
      </SafeAreaView>
    );
  }
  // function toggleCameraType() { 
  //   setType((current) => (
  //     current === CameraType.back ? CameraType.front : CameraType.back
  //   ));
  // }

  const takePhoto = async () => {
    const cameraPermission = await Camera.requestCameraPermissionsAsync()
    setHasCameraPermission(cameraPermission.status === 'granted')
    }
    if(hasCameraPermission){
      console.log("has")
      return (
        <Camera style={styles.container} ref={cameraRef}>
          <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.buttonStyle} onPress={takePic}><Text>Take Pic</Text></TouchableOpacity>
          <TouchableOpacity  style={styles.buttonStyle} onPress={() => navigation.navigate('Home')}><Text>Exit</Text></TouchableOpacity>
          </View>
          <StatusBar style="auto" />
        </Camera>
      );
    }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <View  style={{ alignItems: 'center', justifyContent: 'space-between' }}>
      <TouchableOpacity style={styles.buttonStyle}  onPress={takePhoto}><Text>Take a photo</Text></TouchableOpacity>
      </View>
      <View  style={{ alignItems: 'center', justifyContent: 'space-between' }}>
      <TouchableOpacity  style={styles.buttonStyle} onPress={openImagePickerAsync}><Text>Upload</Text></TouchableOpacity>
      </View>
      </View>
  )
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'green',
    backgroundColor: '#fff',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    justifyContent: 'center',
    margin: 'auto',
  },
  redButton: {
    width: 50,
    height: 50,
    margin: 'auto',
    borderRadius: 35,
    backgroundColor: 'gray',
    border: 0,

    borderRadius: 53,
  },
  buttonContainer: {
    alignSelf: 'center',
    flex: 1,
    alignItems: 'center',
  },
  preview: {
    alignSelf: 'stretch',
    flex: 1,
  },
  thumbnail: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },
  roundButton: {
    width:70,
    height:70,
    bottom:0 ,
    borderRadius:50,
    backgroundColor: '#ffff'
  },
  buttonStyle: {
    width: 130,
    borderRadius: 4,
    backgroundColor: '#F2FFE9',
    color:'#ffff',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
  },
  flip: {
      marginTop: 20,
      borderRadius: '50%',
      height: 25,
      width: 25
  }
})
