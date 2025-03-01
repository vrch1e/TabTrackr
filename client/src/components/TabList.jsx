import TabItem from './TabItem';
import './TabList.css';

export default function TabList({ tabs = [] }) {

    return (
        <div id='container'>
            {tabs.length > 0 ? (
                tabs.map((tab) => (
                    <TabItem key={tab.id} website={tab.site} timespent={tab.timespent} />
                ))
            ) : (
                <p>No tracked data available.</p>
            )}
        </div>
    );
}