import React, { Component } from 'react';
import './timeFrameSelector.css';
import '../../constants.css';

const TimeFrameSelector = (props) => {

    function getButtons(){

        return props.timeframes.map((timeframe) => {

            const timeframeName = timeframe.timeframe;
            const onclick = () => {
                const propsFunction = timeframe.onClickFunction;
                propsFunction(timeframe.argument);
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