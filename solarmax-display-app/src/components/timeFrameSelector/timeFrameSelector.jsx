import React, { Component } from 'react';
import './timeFrameSelector.css';
import '../../constants.css';

const TimeFrameSelector = (props) => {

    function getButtons(){

        return props.timeframes.map((timeframe) => {

            return <button>{timeframe}</button> 
    
        });

    }


    return (
        <div className="container">

            {getButtons()}

        </div>
    );
}
 
export default TimeFrameSelector;