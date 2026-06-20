
// generates a valid tuple of start and destination stations (distance >= 3) and the min distance between them
export const generateStartDestStations = (stations, segments) => {
    // 1. Build the graph --> {station: [list of adjetient stations]}
    const graph = {}
    stations.forEach(st => graph[st.id] = []);

    segments.forEach(seg => {
        graph[seg.stationA].push(seg.stationB);
        graph[seg.stationB].push(seg.stationA);
    });

    // 2. Pick a random start station
    const startStation = stations[Math.floor(Math.random() * stations.length)];

    // 3. BFS algorithm to find the distances between the stations and the startStation
    const distances = {};
    const queue = [{node: startStation.id, dist: 0}];

    distances[startStation.id] = 0;

    while (queue.length > 0) {
        const current = queue.shift(); // takes the very first element of the list and removes it from the list

        graph[current.node].forEach(neighbor => {
            if (distances[neighbor] === undefined) {
                distances[neighbor] = current.dist + 1;
                queue.push({node: neighbor, dist: current.dist + 1});
            }
        })
    }

    // 4. Take just the stations with distance >= 3
    const validDestinations = stations.filter(st => distances[st.id] >= 3);

    // 5. Take a random destination station among the valid ones
    const destStation = validDestinations[Math.floor(Math.random() * validDestinations.length)];

    return {
        start: startStation,
        dest: destStation,
        minDistance: distances[destStation.id]
    }
}


// validates the route sent by the user
// route --> [{stationA, stationB, line_id}, ...]
export const validateRoute = (route, startStationId, destStationId, allSegments) => {
    // empty route
    if (!route || route.length == 0) return {valid: false, reason: "Empty route"};

    // correct startStation
    let firstSeg = route[0];
    if (firstSeg.stationA !== startStationId && firstSeg.stationB !== startStationId) {
        return {valid: false, reason: "The start station must be the one assigned by the system"};
    }

    // correct destStation
    let lastSeg = route[route.length - 1];
    if (lastSeg.stationA !== destStationId && lastSeg.stationB !== destStationId) {
        return {valid: false, reason: "The destination station must be the one assigned by the system"}
    }

    // get the interchange stations
    const stationLines = {};
    allSegments.forEach(seg => { 
        if (!stationLines[seg.stationA]) {
            stationLines[seg.stationA] = new Set(); // use a Set to filter automatically the duplicates
        }
        if (!stationLines[seg.stationB]) {
            stationLines[seg.stationB] = new Set();
        }
        stationLines[seg.stationA].add(seg.lineId);
        stationLines[seg.stationB].add(seg.lineId);
    })

    const isInterchange = (stationId) => stationLines[stationId].size > 1;

    const usedSegments = new Set();
    let currentStation = startStationId;

    for (let i = 0; i < route.length; i++) {
        const seg = route[i];

        // check if the segment has already been used
        const minNode = Math.min(seg.stationA, seg.stationB);
        const maxNode = Math.max(seg.stationA, seg.stationB);

        const segId = `${minNode}-${maxNode}`; // es. segId = 1-2

        if (usedSegments.has(segId)) {
            return {valid: false, reason: `Segment used more than once: ${segId}`};
        }

        usedSegments.add(segId);

        // check if the segment is contiguous to the last one
        let nextStation;
        if (seg.stationA === currentStation) {
            nextStation = seg.stationB;
        } else if (seg.stationB === currentStation) {
            nextStation = seg.stationA;
        } else {
            return ({valid: false, reason: "Non contiguous route"});
        }

        // check the line change
        if (i < route.length - 1) {
            const nextSeg = route[i+1];
            if (seg.lineId !== nextSeg.lineId) {
                if (!isInterchange(nextStation)) {
                    return ({valid: false, reason: "Line change done in a non interchange station"});
                }
            }
        }

        currentStation = nextStation;
    }

    return ({valid: true});
}