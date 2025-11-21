import './Homepage.css'
import Dashboard from './Dashboard'
import { useLoaderData } from 'react-router'

export default function Homepage() {
    const { userId } = useLoaderData();
    console.log(userId)
    return (
        <>
        <div>
            <h1>This is the Homepage. userId: {userId}</h1>
        </div>
        </>
    )
}