import {Card, Badge} from 'react-bootstrap';

function NetworkMap({network, showLines}) {
    
    if (!network) return null;

    const {stations, lines, segments} = network;

    const getStationName = (id) => {
        const station = stations.find(s => s.id === id);
        return station.name;
    }

    const getLineColor = (id) => {
        const colors = {1: 'danger', 2:'primary', 3:'success', 4:'warning'};
        return colors[id];
    }

    const getLineChain = (lineId) => {
        const lineSegments = segments.filter(seg => seg.lineId === lineId);
        if (lineSegments.length === 0) return [];

        let chain = [lineSegments[0].stationA, lineSegments[0].stationB];

        for (let i = 1; i < lineSegments.length; i++) {
            chain.push(lineSegments[i].stationB);
        }

        return chain;
    }

    return (
        <Card className="shadow-sm mb-4 border-secondary">
            <Card.Header className="bg-dark text-white text-center">
                <h5 className="mb-0">Network Map</h5>
            </Card.Header>

            <Card.Body>
                {showLines ? (
                    <div>
                        {lines.map((line) => {
                            const chain = getLineChain(line.id);
                            const colorVariant = getLineColor(line.id);
                            
                            return (
                                <div key={line.id} className="d-flex flex-wrap align-items-center justify-content-center fs-5">
                                    {chain.map((stationId, index) => (
                                        <div key={index} className="d-flex align-items-center mb-2">
                                            <Badge
                                                bg={colorVariant}
                                                text='dark'
                                                className="px-3 py-2 border shadow-sm"
                                            >
                                                {getStationName(stationId)}
                                            </Badge>

                                            {index < chain.length -1 && (
                                                <span className="mx-2 fw-bold text-muted fs-5"> ↔ </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    /* PLANNING - NO LINES */
                    <div className="text-center p-4 bg-light rounded border">
                        <p className="mb-4">Trust your memory to build the best route</p>

                        <div>
                            {stations.map(station => (
                                <Badge
                                    key={station.id}
                                    bg="dark"
                                    className="me-2 mb-2 p-2 fs-6 fw-normal"
                                >
                                    📍 {station.name}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}
            </Card.Body>
        </Card>
    )
}

export default NetworkMap;