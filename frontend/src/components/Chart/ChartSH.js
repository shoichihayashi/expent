import React, { useEffect, useState } from "react";
import {
    Chart as ChartJs, 
    TimeScale,
    CategoryScale,
    LinearScale,
    TimeSeriesScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { Line } from 'react-chartjs-2';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/GlobalContext';
import { dateFormat } from '../../utils/dateFormat';
import ChartDateNavigation from "../Navigation/ChartDateNavigation";
import ChartSelectorNavigation from "../Navigation/ChartSelectorNavigation";

ChartJs.register(
    TimeScale,
    CategoryScale,
    LinearScale,
    TimeSeriesScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
);

// initialize today's date
const today = new Date();
const currentDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

// calculate the timeline for each graph option
function CalcTimeline(originDate) {
    // Calculate the difference in milliseconds
    const timeDifference = currentDate.getTime() - originDate.getTime();
    // Convert the difference to days
    const daysDifference = timeDifference / (1000 * 60 * 60 * 24);
    return daysDifference;
}

// create the spendingsToGraph specific to each graph option
function CreateSpendingsToGraph(timeline, expenses) {
    // initialize hashmap
    const spendingsToGraph = {};
    // track cumulative expenses for timeline
    let expensesCumulative = 0;
    // go through each date in the timeline
    for (let i = timeline; i >= 0; i--) {
        // Generate the date for each label by subtracting the number of days from the current date
        const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
        // Initialize spending for the date
        spendingsToGraph[date.toISOString()] = 0;
        // populate hashmap with dates (keys) tied to spendings (values)
        for (let j = 0; j < expenses.length; j++) {
            // hold variable for the expenses' date
            const expenseDate = new Date(expenses[j].date);
            // if we have expenses with dates in the chart, add expense
            if (date.toDateString() === expenseDate.toDateString()) {
                expensesCumulative += expenses[j].amount;
            }
        }
        // set spendings for each day as cumulative for the week so far
        spendingsToGraph[date.toISOString()] = expensesCumulative;
    }
    return spendingsToGraph;
}

// create the netWorthToGraph specific to each graph option
function CreateNetWorthToGraph(timeline, amount) {
    // initialize hashmap
    const netWorthToGraph = {};
    // go through each date in the timeline
    for (let i = timeline; i >= 0; i--) {
        // Generate the date for each label by subtracting the number of days from the current date
        const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);    
        netWorthToGraph[date.toISOString()] = amount[date.toISOString()];
    }
    return netWorthToGraph;
}

function ChartSH() {
    const { auth, incomes, expenses, getIncomes, getExpenses, transactions, netWorthGraph } = useGlobalContext(); // Include auth context

    useEffect(() => {
        if (auth && auth.token) {
            const config = {
                headers: {
                    Authorization: `Bearer ${auth.token}`
                }
            };
            getIncomes(config);
            getExpenses(config);
        }
    }, [auth, getIncomes, getExpenses]);

    const [selectorNavActive, setSelectorNavActive] = useState(1);
    const [active, setActive] = useState(1);

    const chartSelector = () => {
        switch(selectorNavActive){
            // net worth
            case 1:
                return CreateNetWorthToGraph(timeRange(), netWorthGraph().netWorthMap);
            // spendings
            case 2:
                return CreateSpendingsToGraph(timeRange(), expenses);
            default:
                return CreateNetWorthToGraph(timeRange(), netWorthGraph().netWorthMap);
        }
    }

    const timeRange = () => {
        // initialize a timeframe
        let timeFrame = 0;
        switch(active){
            // week
            case 1:
                return 7;
            // month
            case 2:
                timeFrame = CalcTimeline(new Date(today.getFullYear(), today.getMonth(), 1));
                return timeFrame;
            // year
            case 3:
                return 365;
            // all
            case 4:
                const firstRecordedDate = new Date(transactions().history[0].date);
                timeFrame = CalcTimeline(firstRecordedDate);
                return timeFrame;
            // year
            default: 
                return 365;
        }
    }

    const data = {
        // x -axis
        labels: Object.keys(chartSelector()),
        // y-axis
        datasets:[
            {
                data: Object.values(chartSelector()),
                borderColor: (context) => {
                    const values = context.dataset.data;
                    const mostRecentValue = values[values.length - 2];
                    const firstDayValue = values[0];
                    // Set line color based on conditions
                    if (mostRecentValue > firstDayValue) {
                        return 'green';
                    } else if (mostRecentValue < firstDayValue) {
                        return 'red';
                    } else {
                        return 'orange';
                    }
                },
                borderWidth: 5, // Width of the line
                pointRadius: 0, // Radius of the data points
                pointHoverRadius: 0, // Radius of the data points on hover
            }
        ]
    };

    const options = {
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'day'
                },
            },
            y: {
                beginAtZero: true,
                ticks: {
                    // Include a dollar sign before the tick value
                    callback: function (value) {
                        return value < 0 ? '-$' + Math.abs(value) : '$' + value;
                    },
                },
            }
        },
        plugins: {
            legend: {
                display: false,
            },
        },
        animations: false, // Disable animations
        maintainAspectRatio: false, // Ensure chart doesn't maintain aspect ratio
    };

    return (
        <ChartStyled>
            <ChartSelectorNavigation active={selectorNavActive} setActive={setSelectorNavActive} />
            <div className='chart-con'>
                <Line data={data} options={options} height={null} />
            </div>
            <ChartDateNavigation active={active} setActive={setActive} />
        </ChartStyled>
    );
}

const ChartStyled = styled.div`
  background: #000000;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .chart-con{
    border-left: 5px solid #2497d4;
    border-right: 5px solid #2497d4;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 1rem;
  }
`;

export default ChartSH;
