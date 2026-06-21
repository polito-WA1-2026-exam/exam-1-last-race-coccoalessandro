import {useState, useEffect} from 'react';
import {Card, Button, ListGroup, Badge, Alert} from 'react-bootstrap';

function ExecutionViewer({gameResult, network, onComplete}) {
    
    const [visibleSteps, setVisibleSteps] = useState(0);

    const {stations} = network;

    const isRouteValid = gameResult.success;
    const steps = gameResult.journeySteps ||[];
    const finalScore = gameResult.finalScore;

    useEffect(() => {
        if (!isRouteValid) return;

        if (visibleSteps < steps.length) {
            const timer = setTimeout(() => {
                setVisibleSteps(prev => prev + 1);
            }, 2000)

            return () => clearTimeout(timer);
        }
    }, [visibleSteps, steps.length, isRouteValid]);

    if (!gameResult || !network) return null;

    const getStationName = (id) => {
        const station = stations.find(s => s.id === id);
        return station.name;
    }

    const isAnimationComplete = !isRouteValid || visibleSteps === steps.length;

    return (
        <Card className="shadow-lg border-warning">
            <Card.Header className="bg-warning text-dark text-center">
                <h4 className="mb-0">🚦 Journey Execution 🚦</h4>
            </Card.Header>

            <Card.Body>
                    <div>
                        <div className="text-center mb-4">
                            <h5>Start with 20 coins</h5>
                        </div>

                        <ListGroup className="mb-4">
                            {steps.slice(0, visibleSteps).map((step, index) => (
                                <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <strong>{getStationName(step.segment.stationA)}</strong> 
                                        - 
                                        <strong>{getStationName(step.segment.stationB)}</strong>
                                        <br />
                                        <span className="text-muted small">{step.event.description}</span>
                                    </div>
                                    <div className="text-end">
                                        <Badge bg={step.event.effect >= 0 ? "success" : "danger"} className="fs-6 mb-1">
                                            {step.event.effect > 0 ? "+" : ""}{step.event.effect}
                                        </Badge>
                                        <br />
                                        <small className="fw-bold">Total: {step.coinsAfterStep}</small>
                                    </div>
                                </ListGroup.Item>
                            ))}

                            {visibleSteps < steps.length && (
                                <ListGroup.Item className="text-center py-3 text-muted">
                                    <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                                        To the next station...
                                </ListGroup.Item>
                            )}
                        </ListGroup>

                        {isAnimationComplete && (
                            <div className="text-center p-3 bg-light rounded border border-success">
                                <h3 className="mb-0 text-success">
                                    Journey ended! Score: {finalScore} coins
                                </h3>
                            </div>
                        )}
                    </div>

                <div className="text-center mt-4">
                    <Button
                        variant="primary"
                        size="lg"
                        onClick={onComplete}
                        disabled={!isAnimationComplete}
                    >
                        End Game
                    </Button>
                </div>
            </Card.Body>
        </Card>
    )

}

export default ExecutionViewer;