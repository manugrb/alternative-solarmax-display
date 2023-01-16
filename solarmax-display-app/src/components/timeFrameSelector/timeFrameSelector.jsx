import React, { Component } from 'react';
import './timeFrameSelector.css';
import '../../constants.css';

const TimeFrameSelector = (props) => {

    function getButtons(){

        return props.timeframes.map((timeframe) => {

            const timeframeName = Object.keys(timeframe)[0];
            const onclick = () => {
                const propsFunction = timeframe[timeframeName];
                propsFunction(timeframeName);
            }
            return <button onClick={onclick}>{timeframeName}</button>
    
        });

    }


    return (
        <div className="container">

            {getButtons()}

        </div>
    );
}
 
export default TimeFrameSelector;