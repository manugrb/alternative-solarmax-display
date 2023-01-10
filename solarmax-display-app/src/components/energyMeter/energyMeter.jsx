import React, { Component } from 'react';
import './energyMeter.css';
import '../../constants.css';


const EnergyMeter = (props) => {

    function setValue(energy){

        const energyInKWh = Math.round(energy / 100) / 10;
        return energyInKWh + "kWh";

    }

    return (
        <div className="energyMeterContainer">
            <label htmlFor="energyReadout">{props.name}</label>
            <h1 id="energyReadout" className='EnergyMeter'>{setValue(props.energy)}</h1>
        </div>
    );
}
 
export default EnergyMeter;