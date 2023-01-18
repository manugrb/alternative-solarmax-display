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
            return (
                <div className='spacingDiv'>
                    <button className='timeframeButton' onClick={onclick}>{timeframeName}</button>
                </div>
            );
    
        });

    }


    return (
        <div className="container">
            <div className='wrapper'>
                {getButtons()}
            </div>

        </div>
    );
}
 
export default TimeFrameSelector;