import React, { Component } from 'react';
import './impactMeter.css';
import '../../constants.css';

const ImpactMeter = (props) => {

    function reformatNumber(number, decimalDigits){
    
        const numberToRound = number * (10 ** decimalDigits);
        const roundedNumber = Math.round(numberToRound);
        return (roundedNumber / (10 ** decimalDigits));

    }

    function setValue(number){

        const displayValue = reformatNumber(number, 2);
        const unit = props.unit;

        return displayValue + unit;

    }

    return (
        <div className="impactMeterContainer">
            <label htmlFor="impactReadout">{props.name}</label>
            <h1 id="impactReadout" className='ImpactMeter'>{setValue(props.value)}</h1>
        </div>
    );

}
 
export default ImpactMeter;