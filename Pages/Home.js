import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

export default function Home({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={styles.header}>Choose from Menu:</Text>
      <TouchableOpacity onPress={() =>
        navigation.navigate('Notes Detection')
      }>
        <Text style={styles.menuItem}>Sound to Notes</Text></TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Take Picture')}>
        <Text style={styles.menuItem}>Picture to Sound</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Demo')}>
        <Text style={styles.menuItem}>Demo Page</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('DemoModel')}>
        <Text style={styles.menuItem}>Demo Model</Text>
      </TouchableOpacity>

    </View>
  )
}
const styles = StyleSheet.create({


  header: { 
    fontSize: 30,
    fontWeight: "bold",
    textDecorationLine: "underline" 
  },

  center: {
    justifyContent: "center",
    margin: "auto",
    
  },

  menuItem: { fontSize: 30 }


},
);

