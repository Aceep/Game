// Contains only PURE request function returning the response
// There MUST NOT be any application logic here
import {FetchWithToken} from "./utility.js";

export async function fetch_user_data() {

    try {

        const response = await FetchWithToken("https://localhost:4241/user/data", {
            method: "GET",
            credentials: 'include',
            mode: 'cors'
        });

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();

        return (data);
    }
    catch (error) {
        console.error(`ERROR: ${error}`);
        return (null);
    }
    return (null);
}

export async function fetch_user_history() {

    try {


        const response = await FetchWithToken("https://localhost:4241/user/history", {
            method: "GET",
            credentials: 'include',
            mode: 'cors'
        });

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();

        return (data);
    }
    catch (error) {
        console.error(`ERROR: ${error}`);
    }
    return (null);
}

export async function fetch_stats() {

    try {

        const response = await FetchWithToken("https://localhost:4241/user/game_stat", {
            method: "GET",
            credentials: 'include',
            mode: 'cors'
        });

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();

        return (data);
    }
    catch (error) {
        console.error(`ERROR: ${error}`);
    }
    return (null);
}

export async function fetch_leaderboard() {

    try {

        const response = await FetchWithToken("https://localhost:4241/stats/leaderboard", {
            method: "GET",
            credentials: 'include',
            mode: 'cors'
        });

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();

        return (data);
    }
    catch (error) {
        console.error(`ERROR: ${error}`);
    }
    return (null);
}

export async function fetch_friends() {

    try {

        const response = await FetchWithToken("https://localhost:4241/user/friends", {
            method: "GET",
            credentials: 'include',
            mode: 'cors'
        });

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();

        return (data);
    }
    catch (error) {
        console.error(`ERROR: ${error}`);
    }
    return (null);
}

export async function fetch_guest_data(type, guest_num) {

    try {

        let endpoint;
        if (type === 'tournament') {
            endpoint = "https://localhost:4241/guest/tournament_guest_data";
        } else if (type === 'duel') {
            endpoint = "https://localhost:4241/guest/duel_guest_data";
        } else {
            throw new Error(`Invalid type: ${type}`);
        }

        var headers = new Headers();
        headers.append('Guest-Num', guest_num);
        const response = await FetchWithToken(endpoint, {
            method: "GET",
            headers: headers,
            credentials: 'include',
            mode: 'cors'
        });

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();

        return (data);
    }
    catch (error) {
        console.error(`ERROR: ${error}`);
    }
    return (null);
}

export async function fetch_next_match() {

    try {

        var headers = new Headers();

        const response = await FetchWithToken("https://localhost:4241/game/next_match", {
            method: "GET",
            headers: headers,
            credentials: 'include',
            mode: 'cors'
        });

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();

        return (data.number);
    }
    catch (error) {
        console.error(`ERROR: ${error}`);
    }
    return (null);
}

export async function fetch_game_score(game_num) {

    try {

        var headers = new Headers();
        headers.append('Game-Num', game_num);

        const response = await FetchWithToken("https://localhost:4241/game/score", {
            method: "GET",
            headers: headers,
            credentials: 'include',
            mode: 'cors'
        });

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();

        return (data);
    }
    catch (error) {
        console.error(`ERROR: ${error}`);
    }
    return (null);
}
