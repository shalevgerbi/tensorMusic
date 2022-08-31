import React from 'react'
import { Dimensions, View } from 'react-native'

import FClef from '../img/Fclef.js';
import GClef from '../img/Gclef.js'
import Line from '../img/Line.js';

export default function Bar() {
    const windowWidth = Dimensions.get("window").width;
    return (
        <View id="container" style={{width: '100%'}}>

            <View style={{ position: 'absolute' }}>
                <GClef style={{ zIndex: -1 }} />
            </View>

            <View style={{ width: '100%' }}>
                <Line style={{resize: 'both',width: '100%'}}/>
                <Line style={{width: 'screen'}}/>
                <Line style={{width: 'screen'}}/>
                <Line style={{width: 'screen'}}/>
                <Line style={{width: 'screen'}}/>
            </View>

            <View style={{ margin: 20 }}>
            </View>

            <View style={{ position: 'absolute',zIndex: -1, top: 118 }}>
                <FClef style={{ zIndex: -1 }} />
            </View>

            <View >
                <Line />
                <Line />
                <Line />
                <Line />
                <Line />
            </View>
            
        </View>
    )
}
