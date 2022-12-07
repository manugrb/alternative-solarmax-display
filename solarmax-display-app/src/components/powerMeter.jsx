import React, { Component } from 'react';

function setValue(power){

    return power + "W";

}

const PowerMeter = (props) => {
    return (<h1>{setValue(props.power)}</h1>);
}
 
export default PowerMeter;