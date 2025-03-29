import { ButtonProps } from "../../../types"
import './Button.css';

function Buttons({ selectedPeriod, setSelectedPeriod }: ButtonProps) {

  if (selectedPeriod === 'last24h') {
    return (
      <>
        <button onClick={() => { setSelectedPeriod('week') }}>Week</button>
        <button onClick={() => { setSelectedPeriod('month') }}>Month</button>
      </>
    )
  } else if (selectedPeriod === 'week') {
    return (
      <>
        <button onClick={() => { setSelectedPeriod('last24h') }}>Last 24h</button>
        <button onClick={() => { setSelectedPeriod('month') }}>Month</button>
      </>
    )
  } else {
    return (
      <>
        <button onClick={() => { setSelectedPeriod('last24h') }}>Last 24h</button>
        <button onClick={() => { setSelectedPeriod('week') }}>Week</button>
      </>
    )
  }
}

export default Buttons