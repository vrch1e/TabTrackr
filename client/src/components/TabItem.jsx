import './TabItem.css'

export default function TabItem({ site, timespent }) {

    return ( //  todo: unnecesary fragment
        <>
        <div id='item-container'>
            <h2>{site}</h2>
            <h2>{timespent}</h2>
        </div>
        </>
    )
}