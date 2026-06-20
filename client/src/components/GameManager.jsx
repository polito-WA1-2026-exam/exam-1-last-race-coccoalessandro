import {Container, Button, Alert, Badge} from 'react-bootstrap';
import {useState, useEffect} from 'react';
import {getNetwork, setupGame, executeMove} from '../api/api.js';
import NetworkMap from './NetworkMap.jsx';
import RouteBuilder from './RouteBuilder.jsx';
import ExecutionViewer from './ExecutionViewer.jsx';


function GameManager() {
    
    const [phase, setPhase] = useState('setup');
    const [network, setNetwork] = useState(null); // all the stations and lines
    const [mission, setMission] = useState(null); // startStationId, destStationId

    const [route, setRoute] = useState([]);
    const [timeLeft, setTimeLeft] = useState(90);

    const [gameResult, setGameResult] = useState(null);
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');


    // network loading
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const netData = await getNetwork();
                setNetwork(netData);
            } catch (err) {
                setError("Impossible to load the data.");
            } finally {
                setLoading(false);
            }
        }
        fetchInitialData();
    }, []);


    useEffect(() => {
        let timerId;
        if (phase === 'planning' && timeLeft > 0) {
            timerId = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (phase === 'planning' && timeLeft === 0) {
            handleConfirmRoute(route);
        }

        return () => clearInterval(timerId);
    }, [phase, timeLeft, route]);

    const handleStartPlanning = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await setupGame();
            setMission(data);
            setRoute([]);
            setTimeLeft(90);
            setPhase('planning');
        } catch (err) {
            setError("Impossible to start the game.")
        } finally {
            setLoading(false);
        }
    }

    const handleConfirmRoute = async (finalRoute) => {
        setPhase('execution');
        try {
            const result = await executeMove(mission.startStation.id, mission.destStation.id, finalRoute);
            setGameResult(result);
        } catch (err) {
            setGameResult({
                success: false,
                reason: err.message || "Invalid or incomplete route",
                finalScore: 0
            });
        }
    }

    const handlePlayAgain = () => {
        setPhase('setup');
        setMission(null);
        setGameResult(null);
        setError('');
    }
    
    if (loading && phase === 'setup') {
        return <p>Loading...</p>
    }

    return (
        <Container className="mt-4">
            <h2 className="text-center text-primary mb-4">Last Race</h2>

            {error && <Alert variant="danger">{error}</Alert>}

            {/* PHASE 1 - SETUP */}
            {phase === 'setup' && network && (
                <div className="text-center">
                    <h4>Setup phase</h4>
                    <p>Study the network map. When you're ready, click Start!</p>
                    <NetworkMap network={network} showLines={true}></NetworkMap>
                    <Button variant="success" size="lg" className="mt-4" onClick={handleStartPlanning}>Start</Button>
                </div>
            )}

            {/* PHASE 2 - PLANNING */}
            {phase === 'planning' && mission && (
                <div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4>Build your route</h4>
                        <h4 className="text-primary">Time Left: {timeLeft}s</h4>
                    </div>
                    <NetworkMap network={network} showLines={false}></NetworkMap>
                    <RouteBuilder
                        network={network}
                        mission={mission}
                        route={route}
                        setRoute={setRoute}
                        onConfirm={() => handleConfirmRoute(route)}
                    />
                </div>
            )}

            {/* PHASE 3 - EXECUTE */}
            {phase === 'execution' && (
                <div>
                    <h4 className="text-center mb-3">The train has left!</h4>
                    {!gameResult ? (
                        <div className="text-center mt-5">
                            <div className="spinner-border text-primary" role="status"></div>
                            <p className="mt-3 text-muted">Validating route with the control tower...</p>
                        </div>
                    ) : (
                        <ExecutionViewer
                            gameResult={gameResult}
                            network={network}
                            onComplete={() => setPhase('result')}
                        />
                    )}
                </div>
            )}

            {/* PHASE 4 - RESULT */}
            {phase === 'result' && (
                <div className="text-center mt-5">
                    <h4>Game ended.</h4>
                    <p className="fs-5 mt-3">
                        Final score: <Badge bg="success" className="fs-5">{gameResult?.finalScore || 0} coins</Badge>
                    </p>
                    <Button variant="primary" size="lg" className="mt-4" onClick={handlePlayAgain}>Play again</Button>
                </div>
            )}
            
        </Container>
    )
}

export default GameManager;