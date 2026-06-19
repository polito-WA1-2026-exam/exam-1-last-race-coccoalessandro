import {Container, Card, ListGroup, Row, Col} from 'react-bootstrap';

function Instructions() {
    return (
        <Container className="mt-4">
            <Row className="justify-content-center">
                <Col md={8}>
                    <Card className="shadow-sm">
                        <Card.Header as="h3" className="bg-primary text-white text-center">
                            How to play Last Race
                        </Card.Header>
                        <Card.Body>
                            <Card.Text className="lead text-center">
                                Welcome! Your goal is to navigate the subway system, reaching your assigned destination as smartly as possible. 
                            </Card.Text>

                            <h5 className="mt-4 text-primary">Basic rules</h5>
                            <ListGroup variant="flush">
                                <ListGroup.Item>🪙 You start every game with 20 coins</ListGroup.Item>
                                <ListGroup.Item>⏱️ You have 90 seconds to plan your route. If time runs out before you submit your move, the game ends and your score will be 0.</ListGroup.Item>
                                <ListGroup.Item>🛤️ You can never travel the same segment twice.</ListGroup.Item>
                                <ListGroup.Item>🔄 You can change line only at interchange stations (stations through which two or more lines pass)</ListGroup.Item>
                            </ListGroup>

                            <h5 className="mt-4 text-primary">The Journey and the Unexpected Events</h5>
                            <p>
                                The journey is never without surprises! Once the route is confirmed, the train will
                                depart. For each segment traveled, you may encounter a random event:
                            </p>
                            <ul>
                                <li>Positive events: Ex. You find a coin fallen on the ground (+1), You help an elderly person with their luggage (+2)</li>
                                <li>Negative events: Ex. Sudden strike (-1), Inspector on board, you're wasting time looking for your ticket (-3)</li>
                            </ul>
                            <p className="text-muted small">
                                Note: your score can never drop below zero. If your route is not valid or you try to cheat, you'll immediatly lose all your coins
                            </p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

export default Instructions;