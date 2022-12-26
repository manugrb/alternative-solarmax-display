import React, { Component } from 'react';
import './batteryMonitor.css';
import '../../constants.css';

const BatteryMonitor = (props) => {

    return(
        <div className="batteryMonitorWrapper">

            <div className="batteryBodyOutline">
                <div className="batteryInfill">

                </div>
            </div>
            <div className="batteryPoleOutline">
                <div className="batteryPoleInfill">

                </div>
            </div>

        </div>
    );

}

export default BatteryMonitor;