import React, { useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { Audio } from 'expo-av';
// import file from "http://localhost:19006/be737462-9827-4960-a3e7-bd4d8aa0e4d3";
import * as FileSystem from 'expo-file-system';
export default function NotesDetection(){
  const [recording, setRecording] = useState();
  const [sound, setSound] = useState();
  const [url, setUri] = useState('');

  const play = async() => {
    const splitUrl = url.split('/');
    const lastItem = splitUrl[splitUrl.length - 1];
    
    const { uri } = await FileSystem.downloadAsync(
        url,
        FileSystem.documentDirectory + lastItem
    );
    const source = { uri: uri }; //the source you provide to the loadAsync() method
  }
    
  async function playSound() {
    console.log('Loading Sound');
    const { sound } = await Audio.Sound.createAsync(
       file
    );
    setSound(sound);

    console.log('Playing Sound');
    await sound.playAsync(); }
  
  async function startRecording() {
    try {
      console.log('Requesting permissions..');
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      }); 
      console.log('Starting recording..');
      
      const { recording } = await Audio.Recording.createAsync(
         Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      
      setRecording(recording);
      console.log('Recording started');
    }
    
    catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    console.log('Stopping recording..');
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    setUri(recording.getURI()); 
    console.log('Recording stopped and stored at', url);
    play();
  }
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text>Notes Detection from Sound</Text>
        <TouchableOpacity onPress={ recording ? stopRecording : startRecording }><Text>Click</Text></TouchableOpacity>
    </View>
  )
}
