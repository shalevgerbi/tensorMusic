import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { Button, Image, StyleSheet, Text, View } from "react-native";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-react-native";
import * as mobilenet from "@tensorflow-models/mobilenet";
import { fetch, decodeJpeg } from "@tensorflow/tfjs-react-native";
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from "expo-file-system";
import { Pressable, TouchableOpacity } from "react-native";
export default function App(props) {
  // Load mobilenet.

  const [isTfReady, setIsTfReady] = useState(false);
  const [mobilenetModel, setMobilenetModel] = useState(null);
  const [image, setImage] = useState({
    uri: "./dog.jpg",
  });
  const [predictions, setPredictions] = useState(null);
  useEffect(() => {
    (async function getTensor() {
      await tf.ready();
      setIsTfReady(true);
      try {
        let myModel = await mobilenet.load();
        setMobilenetModel(myModel);
      } catch (err) {
        console.log(err);
      }
    })();

    // const img = new Image()
    // img.src = "./dog.jpg"
    // const img = document.querySelector('img');
    // async function getModel(){
    //  setTimeout(() =>{
    //  const model = mobilenet.load().then(model =>{
    //     console.log(model)
    //     model.classify(img).then(predictions => {
    //       console.log('Predictions:', predictions);
    //     })
    //   });
    // },
    //   1000)
    //   console.log(model)
    // }
    // getModel();

    // console.log(tf)
    // setIsTfReady(true);
  }, []);
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
  const recordAudio = () =>{
    console.log("hi")
  }
  return (
    <View>
      <Text>App</Text>
      <Text>TF Status: {isTfReady ? "👌" : "⏳"}</Text>
      <Text>Mobilenet Model Status: {mobilenetModel ? "👌" : "⏳"}</Text>
      <Text>Hello World</Text>
      <Image
        source={{ uri: image.uri }}
        style={{ width: 200, height: 200, margin: 20 }}
      />
      {/* <HTMLImageElement id="img1" style={{height:224, width: 224}} source={require('./dog.jpg')}/> */}
      <TouchableOpacity
        className="redButton"
        color
        title="Record"
        style={styles.redButton}
        onPress={() => recordAudio()}
        disabled={mobilenetModel ? false : true}
      >
        
        <Text>Record</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        title="Predict"
        onPress={() => mobilenetModel ? selectImage() : undefined}
        disabled={mobilenetModel ? false : true}
      >
        
        <Text> Click</Text>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    
  },
  
  redButton: {
    
    color: "red",
    backgroundColor: "blue",
    width: "50%",
    height: "50%",
    


    
    

  },
});
