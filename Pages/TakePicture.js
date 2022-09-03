import * as React from "react"
import { useEffect, useState } from "react";
import {Image, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-react-native";
import * as mobilenet from "@tensorflow-models/mobilenet";
import {decodeJpeg } from "@tensorflow/tfjs-react-native";
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from "expo-file-system";
import { Camera, CameraType } from 'expo-camera';





export default function TakePicture({navigation}) {
  const [isTfReady, setIsTfReady] = useState(false);
  const [mobilenetModel, setMobilenetModel] = useState(null);
  const [image, setImage] = useState({
    uri: "./dog.jpg",
  });
  const [type, setType] = useState(CameraType.back);
  const [hasPermission, setHasPermission] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [cameraStatus, setCameraStatus] = useState();
  useEffect(() => {
    (async function getTensor() {
      await tf.setBackend('cpu')
      await tf.ready();
      setIsTfReady(true);
      try {
        let myModel = await mobilenet.load();
        setMobilenetModel(myModel);
       
        
      } catch (err) {
        console.log(err);
      }
    })();
    (async () => {
      const options = {quality: 0.5};
      const { status } = await Camera.requestCameraPermissionsAsync();
      // const cameraReady = await Camera.current.onCameraReady(options);
      // console.log(cameraReady.uri)
      setHasPermission(status === 'granted');
    })();

  }, []);
  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  const YourComponent = ({ img }) => {
    const myImage = React.createElement(
      "img",
      {
        src: "./dog.jpg",
        // any other image attributes you need go here
      },
      null
    );

    return { myImage };
  };
  const myClick = async () => {
    const img = document.getElementById("img1");
    console.log(img);
    // console.log(Image.getSize("./dog.jpg"), "success", [failure]);
    console.log("hello");
    mobilenet.load().then((model) => {
      console.log(model);
      model.classify("./dog.jpg").then((predictions) => {
        console.log("Predictions:", predictions);
      });
    });
  };

  // === CLEAR PREDICTIONS ==

  const clearPredictions = () => {
    setPredictions(null);
  };

  // convert image to tensor
  const imageToTensor = (rawImageData) => {
    const TO_UINT8ARRAY = true;
    const { width, height, data } = jpeg.decode(rawImageData, TO_UINT8ARRAY);
    // Drop the alpha channel info for mobilenet
    const buffer = new Uint8Array(width * height * 3);
    let offset = 0; // offset into original data
    for (let i = 0; i < buffer.length; i += 3) {
      buffer[i] = data[offset];
      buffer[i + 1] = data[offset + 1];
      buffer[i + 2] = data[offset + 2];
      offset += 4;
    }
    return tf.tensor3d(buffer, [height, width, 3]);
  };

  const classifyImage = async (imgUri) => {
    try {
      const fileUri = imgUri;
      const imgB64 = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const imgBuffer = tf.util.encodeString(imgB64, "base64").buffer;
      const newData = new Uint8Array(imgBuffer);
      const imageTensor = decodeJpeg(newData); // transforms byte array into 3d tensor
      const prediction = await mobilenetModel.classify(imageTensor);
      setPredictions(prediction);
      console.info(prediction);
    } catch (error) {
      console.log(error);
    }
  };
  const selectImage = async () => {
    try {
      let response = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        aspect: [4, 3]
      })

      if (!response.cancelled) {
        const source = { uri: response.uri }
        await setImage(source);
        classifyImage(response.uri);
      }
    } catch (error) {
      console.log(error)
    }
  }
  
  const takePicture =async  () => {
    if(this.camera){
      this.camera.takePictureAsync({ onPictureSaved: this.onPictureSaved });
    // console.log(picture)
    }
    else{
      console.log("no camera found")
    }
    
  }
  
return (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Take Picture</Text>
    <View className="container">
      <Text>App</Text>
      <Text style={styles.bigBlue}>TF Status: {isTfReady ? "👌" : "⏳"}</Text>
      <Text>Mobilenet Model Status: {mobilenetModel ? "👌" : "⏳"}</Text>

      <Image
        source={{ uri: image.uri }}
        style={{ width: 200, height: 200, margin: 20 }}
      />
      {/* <HTMLImageElement id="img1" style={{height:224, width: 224}} source={require('../dog.jpg')}/> */}
    

      <Text style={styles.center}>Take Picture</Text>
      <TouchableOpacity
        className="redButton"
        style={styles.redButton}
        onPress={() => hasPermission ? takePicture() : <Text>No Permission</Text>}
        disabled={mobilenetModel ? false : true}
      >
      </TouchableOpacity>

      <TouchableOpacity
        title="Predict"
        onPress={() => mobilenetModel ? selectImage() : undefined}
        disabled={mobilenetModel ? false : true}
      >
        <Text> Upload</Text>
      </TouchableOpacity>
      {predictions ? (
        <View style={styles.predictions}>
          <Text
            style={{
              marginBottom: 20
            }}
          >
            I'm {predictions[0].probability.toFixed(2)}% sure it's a{" "}
            {predictions[0].className.toLowerCase()}
            {", "}
            it might also be a {predictions[1].className.toLowerCase()} or{" "}
            {predictions[2].className.toLowerCase()}
          </Text>
          <TouchableOpacity title="Clear" onPress={clearPredictions} />
        </View>
      ) : null}
    </View>
  </View>
)}
const styles = StyleSheet.create({

  container: {


    backgroundColor: "green",
    backgroundColor: "#fff",

    alignItems: "center",
    justifyContent: "center",

  },
  center: {
    justifyContent: "center",
    margin: "auto"
  },
  redButton: {
    width: 50,
    height: 50,
    margin: "auto",
    borderRadius: 35,
    backgroundColor: "gray",
    border: 0,

    
    borderRadius: 35,
    

  }
},
);
