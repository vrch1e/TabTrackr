import { ButtonProps } from "../../../types"
// @ts-ignore
import './Button.css';

function Buttons ({selectedPeriod, setSelectedPeriod}: ButtonProps) {

  // todo done: indentation

  if (selectedPeriod === 'today') {
    return (
      <>
        <button onClick={() => { setSelectedPeriod('week') }}>Week</button>
        <button onClick={() => { setSelectedPeriod('month') }}>Month</button>
      </>
    )
  } else if (selectedPeriod === 'week') {
    return (
      <>
        <button onClick={() => { setSelectedPeriod('today') }}>Today</button>
        <button onClick={() => { setSelectedPeriod('month') }}>Month</button>
      </>
    )
  } else {
    return (
      <>
        <button onClick={() => { setSelectedPeriod('today') }}>Today</button>
        <button onClick={() => { setSelectedPeriod('week') }}>Week</button>
      </>
    )
  }
}

export default Buttons