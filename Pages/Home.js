import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

export default function Home({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Choose from Menu:</Text>
      <TouchableOpacity onPress={() =>
        navigation.navigate('NotesDetection')
      }><Text>Sound to Notes</Text></TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('TakePicture')}>
        <Text>Picture to Sound</Text>
      </TouchableOpacity>

    </View>
  )
}
