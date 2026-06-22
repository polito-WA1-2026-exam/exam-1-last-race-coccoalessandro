
async function getNetwork() {
    try {
        const response = await fetch('http://localhost:3001/api/network', {
            credentials: 'include'
        });

        if (response.ok) {
            const network = await response.json();
            return network
        } else {
            throw new Error("HTTP error in getNetwork, code=" + response.status);
        }
    } catch (ex) {
        throw new Error("Network error", {cause: ex})
    }
}


async function getRanking() {
    try {
        const response = await fetch('http://localhost:3001/api/ranking', {
            credentials: 'include'
        });

        if (response.ok) {
            const ranking = await response.json();
            return ranking
        } else {
            throw new Error("HTTP error in getRanking, code=" + response.status);
        }
    } catch (ex) {
        throw new Error("Network error", {cause: ex})
    }
}


async function setupGame() {
    try {
        const response = await fetch('http://localhost:3001/api/game/setup', {
            credentials: 'include'
        });

        if (response.ok) {
            const gameData = await response.json();
            return gameData
        } else {
            throw new Error("HTTP error in setupGame, code=" + response.status);
        }
    } catch (ex) {
        throw new Error("Network error", {cause: ex})
    }
}


async function executeMove(startStationId, destStationId, route) {
    const response = await fetch('http://localhost:3001/api/game/execute', {
        method: 'POST',
        body: JSON.stringify({
            startStationId: startStationId,
            destStationId: destStationId,
            route: route
        }),
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    })

    if (response.ok) {
        const result = await response.json();
        return result
    } 

    if (response.status === 400) {
        const errorData = await response.json();
        throw new Error(errorData.reason);
    }

    throw new Error("Network error");
}

export { getNetwork, getRanking, setupGame, executeMove }