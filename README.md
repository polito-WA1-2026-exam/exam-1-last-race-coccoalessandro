# Exam #1: "Last Race"
## Student: s353655 Cocco Alessandro 

## React Client Application Routes

- Route `/`: Home page. Shows game instructions for both anonymous and logged in users.
- Route `/login`: Login page.
- Route `/play`: Core game route. Accessible only to authenticated users. Manages the 4 game phases (Setup, Planning, Execution. Result)
- Route `/ranking`: Displays the general ranking with the best scores of each registered user.
- Route `*`: NotFound: fallback 404 page.

## API Server

- POST `/api/sessions`
  - Body: { "username": "string", "password": "string" }
  - Response 201: authenticated user object
  - Example
  
  ```json
  Request: POST /api/sessions
  {
    "username": "player1",
    "password": "password"
  }

  Response: 
  {
    "id": 1,
    "username": "player1"
  }
  ```

- GET `/api/sessions/current`
  - Response 200: user object if authenticated
  - Response 401: { "error": "Unauthenticated" }
  - Example

  ```json
  Request: GET /api/sessions/current

  Response (authenticated):
  {
    "id": 1,
    "username": "player1"
  }

  Response (unauthenticated):
  {
    "error": "unauthenticated"
  }
  ```

- DELETE `/api/sessions/current`
  - Response 200: Success message
  - Example

  ```json
  Request: DELETE /api/sessions/current

  Response:
  (empty body)
  ```

- GET `/api/network`
  - Response 200: Network object containing arrays of all stations, lines and segments
  - Example

  ```json
  Request: GET /api/network

  Response:
  {
    "stations": [{"id": 1, "name": "Centrale"}, ...],
    "lines": [{"id": 1, "name": "Red Line"}, ...],
    "segments": [{"stationA": 1, "stationB": 2, "lineId": 1}, ...]
  }
  ```

- GET `/api/game/setup`
  - Response 200: Randomly assigned starting and destination stations, minimum distance and available segments
  - Example:

  ```json
  Request: GET /api/game/setup

  Response:
  {
    "startStation": {"id": 10, "name": "Garibaldi"},
    "destStation": {"id": 6, "name": "Università"},
    "minDistance": 3,
    "segments": [{"stationA": 1, "stationB": 2, "lineId": 1}, ...]
  }
  ```

- POST `/api/game/execute`
  - Body: {"route": [object], "startStationId": integer, "destStationId": integer} --> array of segments representing the planned route
  - Response 200: execution details including steps, events encountered and score
  - Example

  ```json
  Request: POST /api/game/execute
  {
    "route": [{"stationA": 1, "stationB": 2, "lineId": 1}, ...],
    "startStationId": 1,
    "destStationId": 8
  }
  
  Response:
  {
    "success": true,
    "journeySteps": [
      {
      "segment": {"stationA": 1, "stationB": 2, "lineId": 1},
      "event": {"description": "Kind passenger", "effect": 1},
      "coinsAfterStep": 21
      }
    ],
    "finalScore": 21
  }
  ```

- GET `/api/ranking`
  - Response 200: array of users with their score, sorted in descending order
  - Example:

  ```json
  Request: GET /api/ranking

  Response:
  [
    {"username": "player1", "score": 24},
    {"username": "player2", "score": 21}
  ]
  ```

## Database Tables

- Table `users` - Stores registered users credentials (id, username, password_hash, salt)
- Table `stations` - Stores the unique stations of the network (id, name)
- Table `lines` - Stores the available metro lines (id, name)
- Table `segments` - Represents the connections between stations, acting as edges in the graph (stationA, stationB, line_id)
- Table `events` - Stores all the possible events (id, description, effect)
- Table `games` - Stores the final scores of the played games (id, user_id, score)

## Main React Components

- `App`: Main Layout. It manages routing and the global authentication state.
- `LoginForm`: Renders the login form and handles authentication.
- `GameManager`: The core component in the /play route. 
- `NetworkMap`: A visual representation component used in both Setup and Planning phases.
- `RouteBuilder`: component used in the planning phase. Allows the user to build its own route.
- `ExecutionViewer`: Dispalys the step-by-step journey, the random events and the updating coin balance.
- `Ranking`: Displays the general ranking.

## Screenshot

![Screenshot](/screenshots/general_ranking.png)
![Screenshot](/screenshots/game.png)

## Users Credentials

- player1, password123 (some games played)
- player2, password456 (some games played)
- player3, password789 (no games played)

## Use of AI Tools
During the development of this project I used AI (Gemini) strictly as a styling and layout assistant. I prompted the AI to suggest appropriate React-Bootstrap classes (such as Card styling) to improve the visual presentation and structure of the User interface. 
I manually reviewed all the suggested classes, cross-referenced them with the official React-Bootstrap documentation to ensure they were not deprecated and tested the visual outcome in the browser.