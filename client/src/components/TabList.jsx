import TabItem from './TabItem';
import './TabList.css';

export default function TabList({ tabs }) {

    return (
        <>
        <div id='container'>
            {tabs.map((tab) => (
                <TabItem key={tab.id} website={tab.site} timespent={tab.timespent}></TabItem>
            ))}
        </div>
        </>
    )
}