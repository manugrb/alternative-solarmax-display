import React, { Component } from 'react';
import './powerMeter.css';
import '../../constants.css';

const PowerMeter = (props) => {

    function setValue(power){

        return power + "W";
    
    }

    return (
        <div className="powerMeterContainer">
            <label htmlFor="powerReadout">{props.name}</label>
            <h1 id="powerReadout" className='PowerMeter'>{setValue(props.power)}</h1>
        </div>
    );
}
 
export default PowerMeter;