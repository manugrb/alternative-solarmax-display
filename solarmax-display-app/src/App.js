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
      <PowerMeter power={powerState}/>
    </div>
  );
}

export default App;
