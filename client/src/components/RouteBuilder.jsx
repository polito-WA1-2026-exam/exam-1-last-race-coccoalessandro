import {Card, Button, Badge, Row, Col} from 'react-bootstrap';

function RouteBuilder({network, mission, route, setRoute, onConfirm}) {
    
    if (!network || !mission) return null;

    const {stations, segments} = network;

    const getStationName = (id) => {
        const station = stations.find(s => s.id === id);
        return station.name;
    }

    const handleSegmentClick = (segment) => {
        const isAlreadySelected = route.some(step => 
        (step.stationA === segment.stationA && step.stationB === segment.stationB) ||
        (step.stationB === segment.stationA && step.stationA === segment.stationB)
        );

        if (isAlreadySelected) {
            alert("You have already selected this segment!");
            return;
        }

        const newStep = {
            stationA: segment.stationA,
            stationB: segment.stationB,
            line_id: segment.lineId
        };

        setRoute([...route, newStep]);
    }

    const handleRemoveLast = ()=> {
        setRoute(route.slice(0, -1));
    }
   
    return (
        <Card className="shadow-sm border-primary">
            <Card.Header className="bg-primary text-white text-center">
                <h5 className="mb-0">Your mission</h5>
            </Card.Header>
            <Card.Body>

                <div className="text-center mb-4">
                    <h4 className="fw-bold">
                        <Badge bg="success" className="me-2">Start: {getStationName(mission.startStation.id)}</Badge>
                        <Badge bg="success" className="me-2">Destination: {getStationName(mission.destStation.id)}</Badge>
                    </h4>
                </div>

                <div className="mb-4">
                    <h6 className="text-muted text-uppercase mb-2">Your current route:</h6>
                    {route.length === 0 ? (
                        <p className="text-muted fst-italic">No segments selected yet. Click on the segments below to build your route!</p>
                    ) : (
                        <div>
                            <div className="d-flex flex-wrap gap-2 align-items-center">
                                {route.map((step, index) => (
                                    <Badge key={index} bg="primary" className="p-2 fs-6text-dark-border">
                                        {getStationName(step.stationA)} - {getStationName(step.stationB)}
                                    </Badge>
                                ))}
                            </div>
                            <Button
                                variant="outline-danger"
                                size="sm"
                                className="mt-3"
                                onClick={handleRemoveLast}
                            >
                                Remove Last Segment
                            </Button>
                        </div>
                    )}
                </div>

                <div className="mb-4">
                    <h5 className="text-center mb-3">Available Network Segments</h5>
                    <p className="text-center text-muted small">Scroll and click on the pairs to mentally reconstruct the lines.</p>
                </div>

                <div style={{ maxHeight: '300px', overflowY: 'auto', paddingRight: '5px' }} className="border p-3 rounded bg-white">
                    <Row xs={1} sm={2} md={3} className="g-2">
                        {segments.map((seg, index) => {
                            const isUsed = route.some(step => 
                            (step.stationA === seg.stationA && step.stationB === seg.stationB) ||
                            (step.stationB === seg.stationA && step.stationA === seg.stationB)
                            );

                            return (
                                <Col key={index}>
                                        <Button
                                            variant={isUsed ? "secondary" : "outline-secondary"}
                                            className="w-100 text-truncate py-2"
                                            disabled={isUsed}
                                            onClick={() => handleSegmentClick(seg)}
                                        >
                                            🛑 {getStationName(seg.stationA)} ↔ {getStationName(seg.stationB)}
                                        </Button>
                                    </Col>
                            )
                        })}
                    </Row>
                </div>

                <div className="d-flex justify-content-between mt-4">

                    <Button
                        variant="success"
                        size="lg"
                        onClick={onConfirm}
                        className="px-5"
                    >
                        Confirm route
                    </Button>
                </div>
            </Card.Body>
        </Card>
    )
}

export default RouteBuilder