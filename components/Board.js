import React from 'react';
import { Text, View } from 'react-native';
import Bar from './Bar';

export default function Board({recCount}) {
    //render multiple bars for each recording(need to be change to length of the peace)
    const renderBars = (count) =>{
        let bars;
        return(
            Array.from({length: recCount})
            .map((_, index) => (
                <View key={index}>
                <Text>{index}</Text>
                <Bar key={index} />
                </View>
            )
        )
        )
        }
        
        

    
    return (
        <View style={{width:"100%"}}>
            
            {recCount ? renderBars(recCount) : null}
            
        </View>
    );
    }


