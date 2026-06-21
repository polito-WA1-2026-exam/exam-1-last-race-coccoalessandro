import {Container, Button, Alert, Badge, Col, Card, Row} from 'react-bootstrap';
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
        try {
            const result = await executeMove(mission.startStation.id, mission.destStation.id, finalRoute);
            setGameResult(result);
            setPhase('execution');
        } catch (err) {
            setGameResult({
                success: false,
                reason: err.message || "Invalid or incomplete route",
                finalScore: 0
            });
            setPhase('result')
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
                            <p className="mt-3 text-muted">Validating your route...</p>
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
                <Row className="justify-content-center mt-5">
                    <Col md={8} lg={6}>
                        <Card className={`shadow-lg border-0 rounded-4 overflow-hidden`}>
                            <Card.Header className={`bg-${gameResult.success ? 'success': 'danger'} text-white text-center py-3`}>
                                <h3 className="mb-0 fw-bold">
                                    {gameResult.success ? '🎉 Mission Accomplished! 🎉' : '💥 Mission Failed! 💥'}
                                </h3>
                            </Card.Header>

                            <Card.Body className="p-5 text-center bg-light">
                                <Card.Title className="fs-4 mb-4 text-muted">
                                    {gameResult.success
                                        ? "You successfully reached your destination!"
                                        : "Something went wrong along the way..."
                                    }
                                </Card.Title>

                                <div className="my-4 p-4 bg-white rounded-3 shadow-sm border">
                                    <p className="text-uppercase fw-bold text-muted mb-2">Final Score</p>
                                    <span className={`display-1 fw-bold text-${gameResult?.success ? 'success' : 'danger'}`}>
                                        {gameResult.finalScore}
                                    </span>
                                    <span className="fs-4 text-muted ms-2">coins</span>
                                </div>

                                {gameResult.reason && (
                                    <Alert variant="danger" className="mb-4 shadow-sm">
                                        {gameResult.reason}
                                    </Alert>
                                )}

                                <div className="d-grid mt-4">
                                    <Button 
                                        variant={gameResult.success ? "success" : "primary"} 
                                        size="lg" 
                                        className="py-3 fw-bold rounded-pill shadow-sm"
                                        onClick={handlePlayAgain}
                                    >
                                        <i className="bi bi-arrow-clockwise me-2"></i> Play Again
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}
            
        </Container>
    )
}

export default GameManager;