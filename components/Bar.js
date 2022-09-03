import React, { useState } from 'react'
import { Dimensions, View } from 'react-native'

import FClef from '../img/Fclef.js';
import GClef from '../img/Gclef.js'
import Line from '../img/Line.js';
import QuarterNote from '../img/QuarterNote.js';
import VerticalLine from '../img/VerticalLine.js';

const DISTANCEY = 7.5
const DISTANCEX = 30

export default function Bar() {
    // const [posY,setPosY] = useState(-90);
    // const [posX,setPosX] = useState(50);
    let posX = 50;
    let posY = -90;
    const windowWidth = Dimensions.get("window").width;

    const addPosY = () => {
        setPosY(posY + DISTANCEY)
    }
    const addPosX = () => {
        setPosX(posX + DISTANCEX)
        console.log(posX)

    }
    const addPos = () => {
        addPosY()
        addPosX()
    }
    const makeView = (index) => {
        addPos();
        return (
            <View key={index} style={{ position: 'absolute', top: posY, left: posX }}>
                <QuarterNote />
            </View>
        )

    }
    const renderNotes = (notesCount) => {
        if (notesCount > 4) {
            let cubeSize = 30; 
            let count = notesCount - 4
            let mymap
            const mapArr = []
            let rowDown = 2;
            while (count > 0) {
                mymap = Array.from({ length: 4 })
                    .map((_, index) => (
                        <View key={index} style={{ position: 'absolute', top: posY, left: cubeSize + (posX * index/1.3) }}>
                            <QuarterNote />
                        </View>
                    )
                    )
                mapArr.push(mymap);
                //for GClef
                mapArr.push([
                <View key={posY-100} style={{ position: 'absolute', top: posY-65, left: cubeSize + posX * 3 }}>
                    <VerticalLine/>
                </View>]
                )
                //for FClef
                mapArr.push([
                <View key={posY-100} style={{ position: 'absolute', top: posY+50, left: cubeSize + posX * 3 }}>
                    <VerticalLine/>
                </View>]
                )
                rowDown--
                if(rowDown == 0){
                    posY += 250;
                }
                cubeSize = cubeSize + 170;
                count -= 4;
            }
            return mapArr
        }
        else {
            return (
                Array.from({ length: notesCount })
                    .map((_, index) => (
                        <View key={index} style={{ position: 'absolute', top: posY, left: 50 + posX * index }}>
                            <QuarterNote />
                        </View>
                    )
                    )
            )
        }
    }

    return (
        <View id="container" style={{ width: '100%' }}>

            <View style={{ position: 'absolute' }}>
                <GClef style={{ zIndex: -1 }} />

            </View>

            <View style={{ width: '100%' }}>
                <Line style={{ resize: 'both', width: '100%' }} />
                <Line style={{ width: 'screen' }} />
                <Line style={{ width: 'screen' }} />
                <Line style={{ width: 'screen' }} />
                <Line style={{ width: 'screen' }} />
            </View>

            <View style={{ margin: 20 }}>
            </View>

            <View style={{ position: 'absolute', zIndex: -1, top: 118 }}>
                <FClef style={{ zIndex: -1 }} />
            </View>

            <View >
                <Line />
                <Line />
                <Line />
                <Line />
                <Line />
                {renderNotes(10)}
            </View>
            <View style={{ margin: 20 }}>
            </View>
        </View>

    )
}
//every note is 7.5 distance