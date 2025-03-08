import { Visit } from '../../../types';
// @ts-ignore
import './TabItem.css'

export default function TabItem({ site, timeSpent }: Visit) {

  const formatTime = (ms: number): string => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    return `${hours}h ${minutes}mn`;
  };

  return (
    <div id='item-container'>
      <h2>{site}</h2>
      <h2>{formatTime(timeSpent)}</h2>
    </div>
  )
}