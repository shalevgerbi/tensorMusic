import React, { useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import Board from '../components/Board';

export default function NotesDetection() {
  const [recording, setRecording] = useState();
  const [recordings, setRecordings] = useState([]);
  const [sound, setSound] = useState();
  const [url, setUri] = useState('');

  const play = async () => {
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
      url
    );
    setSound(sound);

    console.log('Playing Sound');
    await sound.playAsync();
  }
  async function stopSound() {
    console.log("stop")
  }

  async function startRecording() {
    try {
      console.log('Requesting permissions..');
      const permissions = await Audio.requestPermissionsAsync();
      
      if (permissions.status === "granted"){
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
        console.log('Starting recording..');
        const { recording } = await Audio.Recording.createAsync(
          Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        );
        setRecording(recording);
        console.log('Recording started');
      }
      else {
        setMessage("Please grant permission to app to access microphone");
      }
    }
    catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    console.log('Stopping recording..');
    setRecording(undefined);
    await recording.stopAndUnloadAsync();

    const updatedRecordings = [...recordings]
    const { sound, status } = await recording.createNewLoadedSoundAsync();
    console.log(recording)
    updatedRecordings.push({
      sound: sound,
      duration: getDurationFormatted(status.durationMillis),
      file: recording.getURI()
    })
    // setUri(recording.getURI());
    console.log('Recording stopped and stored at', url);
    //play(url).then(data => console.log(data));
    // Audio.createNewLoadedSoundAsync();
    // updatedRecordings = true;
    setRecordings(updatedRecordings);
  }
  
  function getDurationFormatted(millis) {
    const minutes = millis / 1000 / 60;
    const minutesDisplay = Math.floor(minutes);
    const seconds = Math.round((minutes - minutesDisplay) * 60);
    const secondsDisplay = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutesDisplay}:${secondsDisplay}`;
  }

  function getRecordingLines() {
    return recordings.map((recordingLine, index) => {
      return (
        <View key={index} style={styles.row}>
          <Text style={styles.fill}>Recording {index + 1} - {recordingLine.duration}</Text>
          <TouchableOpacity style={styles.button} onPress={() => recordingLine.sound.replayAsync()} title="Play"><Text>Play</Text></TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => Sharing.shareAsync(recordingLine.file)} title="Share"><Text>Share</Text></TouchableOpacity>
        </View>
      );
    });
  }
  
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Notes Detection from Sound</Text>
      <TouchableOpacity style={styles.redButton} onPress={recording ? stopRecording : startRecording}>
        <Text style={{ fontSize: 30 }}>Click</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.headers} onPress={url ? playSound : stopSound}>
        <Text style={{ fontSize: 30 }}>play sound</Text>
      </TouchableOpacity>
      {recording ? <Text>Recording...</Text> : null}
      {getRecordingLines()}
      <Board/>
    </View>
  )
}
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
    fontSize: 0,
    bottom: 0,

    backgroundColor: "red",
    border: 0,
    borderRadius: 35,
    margin: 18,
    

  }
},
);

