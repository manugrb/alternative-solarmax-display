import logo from './logo.svg';
import './App.css';
import PowerMeter from './components/powerMeter/powerMeter';
import BatteryMonitor from './components/batteryMonitor/batteryMonitor';
import React, { useEffect, useState } from 'react';
import EnergyMeter from './components/energyMeter/energyMeter';
import TimeFrameSelector from './components/timeFrameSelector/timeFrameSelector';


const App = () => {

    const [solarPowerState, setSolarPowerState] = useState("");
    const [housePowerState, setHousePowerState] = useState("");
    const [gridPowerState, setGridPowerState] = useState("");
    const [batteryPowerState, setBatteryPowerState] = useState("");
    const [batteryFill, setBatteryFill] = useState(0);

    const [producedEnergyState, setProducedEnergyState] = useState(0);
    const [usedEnergyState, setUsedEnergyState] = useState(0);
    const [boughtEnergyState, setBoughtEnergyState] = useState(0);
    const [soldEnergyState, setSoldEnergyState] = useState(0);

    const [updateInterval, setUpdateInterval] = useState();
    const [energyUpdateInterval, setEnergyUpdateInterval] = useState();
    let continouslyFetchingData = false;

  function getBatteryFillPercentage(batteryCharge, batteryCapacity){

    return batteryCharge / batteryCapacity;

  }

  useEffect(() => {

    updateEnergyValues();

    if(!continouslyFetchingData){

        setEnergyUpdateInterval(setInterval(() => {

          updateEnergyValues();

        }, 60 * 10 * 1000));
     
        setUpdateInterval(setInterval(() => {

          fetch('http://192.168.179.17:3001/general').then((value) => {
            console.log(value);
            return value.json();
          }).then((value) => {

            const solarData = value;

            const solarPower = solarData.solarPower;
            setSolarPowerState(solarPower);

            const housePower = solarData.housePower;
            setHousePowerState(housePower);

            const gridPower = solarData.gridPower;
            setGridPowerState(gridPower);

            const batteryPower = solarData.batteryPower;
            setBatteryPowerState(batteryPower);

            const batteryCharge = solarData.batteryCharge;
            const batteryCapacity = solarData.batteryCapacity;
            const batteryFill = getBatteryFillPercentage(batteryCharge, batteryCapacity);
            setBatteryFill(batteryFill);

          });

          }, 1000)
        );

      continouslyFetchingData = true;
  
    }

    return () => {
      clearInterval(updateInterval);
      clearInterval(energyUpdateInterval);
    }

  }, []);

  function updateEnergyValues(){

    fetch('http://192.168.179.17:3001/producedPower?timeframe=today').then((value) => {
      console.log(value);
      return value.json();
    }).then((value) => {
      setProducedEnergyState(value["producedEnergy"]);
    });


    fetch('http://192.168.179.17:3001/usedPower?timeframe=today').then((value) => {
      return value.json();
    }).then((value) => {
      setUsedEnergyState(value["usedEnergy"]);
    });

    fetch('http://192.168.179.17:3001/boughtPower?timeframe=today').then((value) => {
      return value.json();
    }).then((value) => {
      setBoughtEnergyState(value["boughtEnergy"]);
    });

    fetch('http://192.168.179.17:3001/soldPower?timeframe=today').then((value) => {
      return value.json();
    }).then((value) => {
      setSoldEnergyState(value["soldEnergy"]);
    });

  }

  return (
    <div>

      <div className="headingDiv">
          <h1>Solar Monitor</h1>
      </div>


      <div className="sectionsContainer">

        <div className="generalInformation">
          <h2>General information</h2>
          <div className="powerMeterContainer">
            <PowerMeter power={solarPowerState} name={"Solar power"}/>
            <PowerMeter power={housePowerState} name={"House power"}/>
            <PowerMeter power={gridPowerState} name={"Grid power"}/>
            <PowerMeter power={batteryPowerState} name={"Battery Power"} />

            <BatteryMonitor batteryFill={batteryFill} />
          </div>
        </div>

        <div className="results">
          <h2>Results</h2>

          <div className="energyMeterContainer">
            <TimeFrameSelector timeframes={["today", "this month"]}/>
            <EnergyMeter energy={producedEnergyState} name={"Today's Solar Energy"} />
            <EnergyMeter energy={usedEnergyState} name={"Today's Used Energy"} />
            <EnergyMeter energy={boughtEnergyState} name={"Today's Bought Energy"} />
            <EnergyMeter energy={soldEnergyState} name={"Today's Sold Energy"} />
          </div>

        </div>

        <div className="impact">
            <h2>Impact (not yet implemented)</h2>
        </div>

      </div>

    </div>
  );
}

export default App;
