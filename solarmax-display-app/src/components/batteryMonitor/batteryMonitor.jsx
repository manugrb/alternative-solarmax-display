import React, { Component } from 'react';
import './batteryMonitor.css';
import '../../constants.css';

const BatteryMonitor = (props) => {


    function getBodyInfill(batteryFill){

        if(batteryFill >= 0.95) return "100%";

        const fill = (batteryFill / 0.95) * 100;
        return fill + "%";

    }

    function getBatteryFillText(batteryFill){

        const batteryFillTimesHundred = batteryFill * 10000;
        const batteryFillTimesHundredRounded = Math.round(batteryFillTimesHundred);
        const batteryFillPercent = batteryFillTimesHundredRounded / 100;

        return batteryFillPercent + "%";

    }

    return(
        <div className="batteryMonitorWrapper">

            <div className="batteryBodyOutline">
                <div className="batteryInfill" style={{width: getBodyInfill(props.batteryFill)}}>
                    <h1 className="batteryFillText">{getBatteryFillText(props.batteryFill)}</h1>
                </div>
            </div>
            <div className="batteryPoleOutline">

            </div>

        </div>
    );

}

export default BatteryMonitor;