import './TabItem.css'

export default function TabItem({ website, timespent }) {

    return (
        <>
        <div id='item-container'>
            <h2>{website}</h2>
            <h2>{timespent}</h2>
        </div>
        </>
    )
}