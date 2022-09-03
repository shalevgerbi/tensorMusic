import React, { useState } from 'react';
import { Text, View } from 'react-native';
import Slider from '@react-native-community/slider'



export default function BPMSlider(){
    const [range,setRange] = useState(50);

    return (
        <View style={{alignItems: 'center', margin:20}}>
            <Text>BPM</Text>
            <Text>{range}</Text>
            <Slider
              style={{width: 200, height: 50}}
              minimumValue={50}
              maximumValue={280}
              onValueChange={(value) => setRange(value.toFixed())}
            />

        </View>
    );
}
