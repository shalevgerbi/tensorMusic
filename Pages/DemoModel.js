
import React, { useEffect, useState } from 'react'

import { Text, View } from 'react-native'

import * as tf from '@tensorflow/tfjs'
// import * as tf from 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs'
import { bundleResourceIO, decodeJpeg } from '@tensorflow/tfjs-react-native'

import * as FileSystem from 'expo-file-system';



let model;
async function startDemo() {
    model = await tf.loadGraphModel('../models/model.json');
    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      .then(handleSuccess).catch(handleError);
  }


 //Loading model from models folder
 const modelJSON = require("../models/model.json");

 const modelWeights = [require("../models/group1-shard1of4.bin"),require("../models/group1-shard2of4.bin"),
   require("../models/group1-shard3of4.bin"),require("../models/group1-shard4of4.bin")];



// Load the model from the models folder
 const loadModel = async () => {
   const model = await tf
     .loadLayersModel(bundleResourceIO(modelJSON, Number(modelWeights)))
     .catch(e => console.log(e));
   console.log("Model loaded!");
   return model;
 };

// const loadModel = async () => {
//     // const model = await tf.loadLayersModel('../models/model.json')
//     // console.log(model)
//     startDemo();
//     // const model = await fetch('../models/model.json').then(data => console.log(data));
//     // document.body.innerHTML = model.text()
//     // console.log(res)
//     // .ts: const loadModel = async ():Promise<void|tf.LayersModel>=>{
//     // const model = await tf.loadLayersModel(ModelJSON);
//     // const model = await tf.loadLayersModel(
//         // bundleResourceIO(ModelJSON, '../models')
//     // ).catch((e) => {
//         // console.log("[LOADING ERROR] info:", e)
//     // })
//     return model
// }
const load = async () => {
    try {
      // Load mobilenet.
      await tf.ready();
    //   const model = await ModelJSON.load();
      setIsTfReady(true);

      // Start inference and show result.
    //   const image = require('./basketball.jpg');
      const imageAssetPath = Image.resolveAssetSource(image);
      const response = await fetch(imageAssetPath.uri, {}, { isBinary: true });
      const imageDataArrayBuffer = await response.arrayBuffer();
      const imageData = new Uint8Array(imageDataArrayBuffer);
      const imageTensor = decodeJpeg(imageData);
      const prediction = await model.classify(imageTensor);
      if (prediction && prediction.length > 0) {
        setResult(
          `${prediction[0].className} (${prediction[0].probability.toFixed(3)})`
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

export default function DemoModel({navigatior}) {
    const [isTfReady, setIsTfReady] = useState(false);
    const [result, setResult] = useState('');

    const [modelReady, setModelReady] = useState(null);
    useEffect(() => {
      (
      async function() {
        await tf.setBackend('cpu');
        await tf.ready();
        setIsTfReady(true);
        const bundel = bundleResourceIO(modelJSON,modelWeights);
        const MODEL=await tf.loadGraphModel(bundel);
        MODEL ? setModelReady(MODEL) : null ;
      }
      )
      ()
    },[])
    // loadModel().then(console.log("model added"))
    return (
        <View>
            <Text>Hello</Text>
            {modelReady ? <Text>model ready</Text>: <Text> model Loading...</Text>}
            {isTfReady ? <Text>tf ready</Text>: <Text> tf Loading...</Text>}

        </View>
    )
}
