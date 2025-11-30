import './Reports.css'
import { useSelector } from 'react-redux'

export default function Reports() {
    const siteTabs = useSelector((state) => {return state.sites.sites});
    console.log('siteTabs in reports page: ', siteTabs);
    return (
        <>
        <h1>This is the Reports page</h1>
        <h2>{siteTabs}</h2>
        </>
    )
}