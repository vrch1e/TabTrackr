import { TabListProps } from '../../../types';
import TabItem from './TabItem';
import './TabList.css';

export default function TabList({ tabs }: TabListProps) {

  return (
    <div id='container'>
      {tabs.length > 0
        ?
        tabs.map(tab => <TabItem key={tab.id} site={tab.site} timeSpent={tab.timeSpent} />)
        :
        <p>No tracked data available.</p>
      }
    </div>
  );
}