import logo from './logo.svg';
import './App.css';
import PowerMeter from './components/powerMeter/powerMeter';
import { useEffect, useState } from 'react';


const App = () => {

  const [powerState, setPowerState] = useState("");

  useEffect(() => {

    fetch('http://127.0.0.1:3001/general').then((value) => {
      return value.json();
    }).then((value) => {

      const solarData = value;
      const solarPower = solarData.solarPower;
      setPowerState(solarPower);

    });

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
            <PowerMeter power={powerState} name={"Solar power"}/>
            <PowerMeter power={powerState} name={"House power"}/>
            <PowerMeter power={powerState} name={"Grid power"}/>
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
