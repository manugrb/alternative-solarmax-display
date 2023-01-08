import logo from './logo.svg';
import './App.css';
import PowerMeter from './components/powerMeter/powerMeter';
import BatteryMonitor from './components/batteryMonitor/batteryMonitor';
import { useEffect, useState } from 'react';


const App = () => {

    const [solarPowerState, setSolarPowerState] = useState("");
    const [housePowerState, setHousePowerState] = useState("");
    const [gridPowerState, setGridPowerState] = useState("");
    const [batteryPowerState, setBatteryPowerState] = useState("");
    const [batteryFill, setBatteryFill] = useState(0);
    let continouslyFetchingData = false;

  function getBatteryFillPercentage(batteryCharge, batteryCapacity){

    return batteryCharge / batteryCapacity;

  }

  useEffect(() => {

    if(!continouslyFetchingData){
     
      setInterval(() => {

        fetch('http://192.168.179.17:3001/general').then((value) => {
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

      }, 1000);

      continouslyFetchingData = true;
  
    }

  }, []);

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
          <h2>Results (not yet implemented)</h2>

        </div>

        <div className="impact">
            <h2>Impact (not yet implemented)</h2>
        </div>

      </div>

    </div>
  );
}

export default App;
