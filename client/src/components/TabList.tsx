import { TabListProps } from '../../../types';
import TabItem from './TabItem';
// @ts-ignore
import './TabList.css';


export default function TabList({ tabs }: TabListProps) {


  // todo: unnec. parentheses around args + indentation?
  return (
    <div id='container'>
      {tabs.length > 0 ? (
        tabs.map((tab) => (
          <TabItem key={tab.id} id={tab.id} site={tab.site} totalTimeSpent={tab.totalTimeSpent} />

        ))
      ) : (
        <p>No tracked data available.</p>
      )}
    </div>
  );
}

//<TabItem key={tab.id} site={tab.site} timespent={formatTime(tab.totalTimeSpent)} />