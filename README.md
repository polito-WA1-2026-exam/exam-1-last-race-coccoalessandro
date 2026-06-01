# Exam #1: "Last Race"
## Student: s353655 Cocco Alessandro 

## React Client Application Routes

- Route `/`: Home page. Shows game instructions for anonymous users and a welcome page for logged-in users.
- Route `/login`: Login page.
- Route `/play`: Core game route. Accessible only to authenticated users. Manages the 4 game phases (Setup, Planning, Execution. Result)
- Route `/ranking`: Displays the general ranking with the scores of all registered users.
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
  {
    "message": "Logout successful"
  }
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
  - Response 200: Randomly assigned starting and destination stations IDs
  - Example:

  ```json
  Request: GET /api/game/setup

  Response:
  {
    "startStationId": 1, 
    "destinationStationId": 8
  }
  ```

- POST `/api/game/execute`
  - Body: {"route": [integer]} --> array of stationIds representing the planned route
  - Response 200: execution details including steps, events encountered and score
  - Example

  ```json
  Request: POST /api/game/execute
  {
    "route": [1, 2, 7, 8]
  }
  
  Response:
  {
    "isValid": true,
    "steps": [
      {"from": 1, "to": 2, "event": "Kind passenger", "coins": 21},
      ...
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
- `ExecutionViewer`: Dispalys the step-by-step journey, the random events and the updating coin balance

## Screenshot

![Screenshot](./img/screenshot.jpg)

## Users Credentials

- player1, password123
- player2, password456

## Use of AI Tools
Briefly describe whether you used any AI tools (e.g., ChatGPT, GitHub Copilot, Claude) while working on this project, for which purposes (e.g., clarifying concepts, debugging, generating code), and how you verified or adapted their output.
If you did not use any AI tools, simply state so.
