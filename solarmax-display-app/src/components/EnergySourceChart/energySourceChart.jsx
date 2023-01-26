import React, { Component } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import './energySourceChart.css';
import '../../constants.css';

const EnergySourceChart = () => {

    ChartJS.register(ArcElement, Tooltip, Legend);

    const data = {
        labels: ['Bought', 'Self produced'],
        datasets: [
            {
                label: "# of tests",
                data: [3700, 9000],
                backgroundColor: [
                    '#ff0000',
                    '#00ff00'
                ],
                borderColor: [
                    '#000000',
                    '#222222',
                    '#444444',
                    '#666666',
                    '#888888',
                    '#aaaaaa'
                ],
                borderWidth: 1
            }
        ]
    };

    return (
        <Doughnut data={data} />
    );
}
 
export default EnergySourceChart;