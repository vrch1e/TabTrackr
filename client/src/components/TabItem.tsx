import { Visit } from '../../../types';
// @ts-ignore
import './TabItem.css'

export default function TabItem({ site, totalTimeSpent }: Visit) {

  const formatTime = (ms: number): string => {

    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);

    return `${hours}h ${minutes}m`; // 'mn'
  };

  return ( //  todo: unnecesary fragment
    <>
      <div id='item-container'>
        <h2>{site}</h2>
        <h2>{formatTime(totalTimeSpent)}</h2>
      </div>
    </>
  )
}