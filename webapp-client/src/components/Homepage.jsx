import './Homepage.css'
import { useEffect, useState } from 'react';

export default function Homepage() {
    const [search, setSearch] = useState('')

    return (
        <>
        <div className="homepage-container">
            <div className="searchbar-container">
                <div id="back-button">
                    <svg id="back-button-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 40 40" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
                    </svg>
                </ div>
                <div className="searchbar-wrapper">
                    <svg id='searchicon' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 40 40" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                    <input id="websearch" type="text" placeholder="Search Websites..." />
                </div>
            </div>
        </div>
        </>
    )
}