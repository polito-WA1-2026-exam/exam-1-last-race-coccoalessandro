import {Container, Alert, Table} from 'react-bootstrap';
import {useState, useEffect} from 'react';
import {getRanking} from '../api/api.js';

function Ranking() {
    
    const [ranking, setRanking] = useState([]);
    const [loading, setLoading] = useState(true); // manages the possible waiting for the server's response 
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRanking = async () => {
            try {
                const data = await getRanking();
                setRanking(data);
            } catch (err) {
                setError("Impossible to load the ranking.")
            } finally {
                setLoading(false);
            }
        }

        fetchRanking();
    }, []);

    return (
        <Container className="mt-4">
            <h2 className="text-center mb-4 text-primary">General Ranking</h2>

            {loading && (
                <div className="text-center mt-5">
                    <p className="mt-2">Loading the ranking...</p>
                </div>
            )}

            {error && <Alert variant="danger">{error}</Alert>}

            {!loading && !error && ranking.length === 0 && (
                <Alert variant="info" className="text-center">No scores registered so far. Play to be the first one!</Alert>
            )}

            {!loading && !error && ranking.length > 0 && (
                <Table striped bordered hover responsive className="shadow-sm bg-white">
                    <thead className="table-dark">
                        <tr>
                            <th className="text-center" style={{ width: '10%' }}>Rank</th>
                            <th>Player</th>
                            <th className="text-center" style={{ width: '20%' }}>Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ranking.map((row, index) => (
                            <tr key={index}>
                                <td className="text-center fw-bold">{index + 1}°</td>
                                <td>{row.username}</td>
                                <td className="text-center">{row.score}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </Container>
    )
}

export default Ranking;