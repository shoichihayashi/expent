import ChartNavigation from "../components/Navigation/ChartNavigation";


const option = ChartNavigation.key
const time = 7

function SetTimeline() {
    if (option === 1) {
        time = new Date();
    }
    if (option === 2) {
        time = 7
    }
    if (option === 3) {
        time = 7
    }
    if (option === 4) {
        time = 7
    }
    if (option === 5) {
        time = 7
    }
}

export default SetTimeline;