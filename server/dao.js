import sqlite from 'sqlite3'
import crypto from 'crypto'

const db = new sqlite.Database("database.sqlite", (err) => {
    if (err) throw err;
    console.log("Connected to the SQLite Database.");
})

// USER

export const getUser = (username, password) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM users WHERE username = ?";
        db.get(sql, [username], (err, row) => {
            if (err) reject(err);
            else if (row === undefined) {
                resolve(false); // NOT FOUND USER
            } else {
                const user = {id: row.id, username: row.username};

                crypto.scrypt(password, row.salt, 64, (err, hashedPassword) => {
                    if (err) reject(err);
                    if (!crypto.timingSafeEqual(Buffer.from(row.password, "hex"), hashedPassword)) {
                        resolve (false); // WRONG PASSWORD
                    } else {
                        resolve (user); // LOGIN OK
                    }
                })
            }
        })
    })
}

export const getUserById = (id) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT id, username FROM users WHERE id = ?";
        db.get(sql, [id], (err, row) => {
            if (err) reject(err);
            else if (row === undefined) {
                resolve({error: "User not found"})
            }
            else resolve(row);
        })
    })
}


// NETWORK (stations, lines, segments)

export const getStations = () => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM stations";
        db.all(sql, [], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        })
    })
}

export const getLines = () => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM lines";
        db.all(sql, [], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        })
    })
}

export const getSegments = () => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT stationA, stationB, line_id as lineId FROM segments";
        db.all(sql, [], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        })
    })
}


// EVENTS

export const getEvents = () => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM events";
        db.all(sql, [], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        }) 
    })
}


// RANKING

export const getRanking = () => {
    return new Promise((resolve, reject) => {
        const sql = `
        SELECT users.username, MAX(games.score) as score
        FROM users, games
        WHERE users.id = games.user_id
        GROUP BY users.username
        ORDER BY games.score DESC
        `
        db.all(sql, [], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        })
    })
}


// SAVE THE GAME

export const saveGame = (userId, score) => {
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO games (user_id, score) VALUES (?, ?)";
        db.run(sql, [userId, score], function(err) {
            if (err) reject(err);
            else resolve(this.lastID);
        })
    })
}