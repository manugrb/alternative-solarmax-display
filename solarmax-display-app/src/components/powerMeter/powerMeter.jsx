import React, { Component } from 'react';
import './powerMeter.css'

function setValue(power){

    return power + "W";

}

const PowerMeter = (props) => {
    return (<h1 className='PowerMeter'>{setValue(props.power)}</h1>);
}
 
export default PowerMeter;