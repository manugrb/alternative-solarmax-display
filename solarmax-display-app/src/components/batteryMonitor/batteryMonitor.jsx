import React, { Component } from 'react';
import './batteryMonitor.css';
import '../../constants.css';

const BatteryMonitor = (props) => {


    function getBodyInfill(batteryFill){

        if(batteryFill >= 0.95) return "100%";

        const fill = (batteryFill / 0.95) * 100;
        return fill + "%";

    }

    return(
        <div className="batteryMonitorWrapper">

            <div className="batteryBodyOutline">
                <div className="batteryInfill" style={{width: getBodyInfill(props.batteryFill)}}>

                </div>
            </div>
            <div className="batteryPoleOutline">

            </div>

        </div>
    );

}

export default BatteryMonitor;