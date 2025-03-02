import './TabItem.css'

export default function TabItem({ site, timespent }) {

    return (
        <>
        <div id='item-container'>
            <h2>{site}</h2>
            <h2>{timespent}</h2>
        </div>
        </>
    )
}