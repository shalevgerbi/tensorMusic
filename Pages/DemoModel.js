
import React, { useEffect, useState } from 'react'

import { Text, TouchableOpacity, View } from 'react-native'

import * as tf from '@tensorflow/tfjs'
import { bundleResourceIO, decodeJpeg } from '@tensorflow/tfjs-react-native'

import * as FileSystem from 'expo-file-system';

//Loading model from models folder
const modelJSON = require("../models/model.json");

const modelWeights = [
  require("../models/group1-shard1of4.bin"),
  require("../models/group1-shard2of4.bin"),
  require("../models/group1-shard3of4.bin"),
  require("../models/group1-shard4of4.bin")
];

const example = require('../examples/demo.wav')

export default function DemoModel({ navigatior }) {
  const [isTfReady, setIsTfReady] = useState(false);
  const [result, setResult] = useState('');
  const [modelReady, setModelReady] = useState(false);
  const [model, setModel] = useState();

  useEffect(() => {
    (async function () {
      await tf.setBackend('cpu');
      await tf.ready();
      setIsTfReady(true);
      const bundel = bundleResourceIO(modelJSON, modelWeights);
      const MODEL = await tf.loadGraphModel(bundel);
      setModel(MODEL)
      console.log("model loaded")
      setModelReady(true)

    }
    )()
  }, [])

  const readWavFile = async() => {
    return new Promise(resove => {
      var request = new XMLHttpRequest();
      request.open('GET', '../examples/demo.wav', true);
      request.responseType = 'arraybuffer';

      request.onload = function () {
        audioContext.decodeAudioData(request.response, function(buffer) {
          resolve(buffer)
        });
      };
      request.send()
    })

  }
  const buildSpectrogram = async() =>{
    
    var audioContext = new AudioContext();
    const buffer = await readWavFile()
    
  }

  

  const modelPredict = async () => {
   const content = await FileSystem.writeAsStringAsync('../examples/demo.wav', { encoding: FileSystem.EncodingType.Base64 });
   console.log(content)

    // const waveform = tf.audio.decode_wav(example)
    // model.predict(example)
    // console.log(waveform)
  }
  return (
    <View>
      <Text>Hello</Text>
      {modelReady ? <Text>model ready</Text> : <Text> model Loading...</Text>}
      {isTfReady ? <Text>tf ready</Text> : <Text> tf Loading...</Text>}
      <TouchableOpacity onPress={() => modelPredict()}><Text>Predict</Text></TouchableOpacity>
    </View>
  )
}
