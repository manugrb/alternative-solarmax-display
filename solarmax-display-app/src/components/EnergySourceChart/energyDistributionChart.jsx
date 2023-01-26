import React, { Component } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import './energyDistributionChart.css';
import '../../constants.css';

const EnergySourceChart = (props) => {

    ChartJS.register(ArcElement, Tooltip, Legend);

    function createData(){

        const data = {
            labels: props.labels,
            datasets: [
                {
                    label: props.datasetLabel,
                    data: props.data,
                    backgroundColor: [
                        '#00ff00',
                        '#ff0000'
                    ],
                    borderColor: [
                        '#00ff00',
                        '#ff0000'
                    ],
                    borderWidth: 1
                }
            ]
        };

        return data;

    }

    return (
        <Doughnut data={createData()} />
    );
}
 
export default EnergySourceChart;