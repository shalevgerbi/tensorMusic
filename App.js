import * as React from "react"
import "@tensorflow/tfjs-react-native";
import * as mobilenet from "@tensorflow-models/mobilenet";
import TakePicture from "./Pages/TakePicture";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from "./Pages/Home";
import NotesDetection from "./Pages/NotesDetection";
import Demo from "./Pages/Demo";
import DemoModel from "./Pages/DemoModel";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} props={mobilenet} />
        <Stack.Screen name="Notes Detection" component={NotesDetection} />
        <Stack.Screen name="Take Picture" component={TakePicture} />
        <Stack.Screen name="Demo" component={Demo} />
        <Stack.Screen name="DemoModel" component={DemoModel} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}