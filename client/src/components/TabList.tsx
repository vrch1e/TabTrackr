import { TabListProps } from '../../../types';
import TabItem from './TabItem';
// @ts-ignore
import './TabList.css';

export default function TabList({ tabs }: TabListProps) {

  // todo done: renamed timeSpent as totalTimeSpent and moved format function to tabItem component to be able to pass a type Visit to it
  // todo done: removed unnec. parentheses around statements, argument and returned element (see old version on the bottom)
  return (
    <div id='container'>
      {tabs.length > 0
        ?
          tabs.map( tab =>
            <TabItem key={tab.id} site={tab.site} totalTimeSpent={tab.totalTimeSpent} />
          )
        :
          <p>No tracked data available.</p>
      }
    </div>
  );
}

/* return (
  <div id='container'>
    {tabs.length > 0 ? (
      tabs.map((tab) => (
        <TabItem key={tab.id} id={tab.id} site={tab.site} totalTimeSpent={tab.totalTimeSpent} />

      ))
    ) : (
      <p>No tracked data available.</p>
    )}
  </div>
); */