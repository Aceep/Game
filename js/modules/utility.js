export function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

export async function get_csrf_token() {
    await fetch("https://localhost:4241/authent/get_csrf_token", {
        method: "GET",
        credentials: 'include',
        mode: "cors"
        }
    )
    .catch(error => {
        console.error('Error generating token: ', error);
    }
    );
}

// Function to get a new access token in case it expired
// (and if the refresh token is not expired)
async function refreshToken() {

    try {
        const refreshToken = localStorage.getItem('refresh_token');

        if (!refreshToken) {
            console.error('Refresh token not found');
            return (null);
        }
        const response = await fetch('https://localhost:4241/authent/refresh_jwt', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                refresh: refreshToken
            })
        });
        if (!response.ok) {
            console.error('Failed to refresh token');
            throw new Error(`HTTP error: ${response.status}`);
        }
        else {
            const token = await response.json();
            localStorage.setItem('access_token', token.access);
            return (token.access);
        }
    }
    catch (error) {
        console.error(`ERROR: ${error}`);
        return (null);
    }
}

export async function FetchWithToken(url, options) {

    let accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
        console.error('Access token not found');
        return (new Response("", { status: 401, statusText: "Access Token missing" }));
    }

    let headers = options.headers;
    if (!headers) {
        headers = new Headers();
    }
    else if (!(headers instanceof Headers)) {
        headers = new Headers(options.headers);
    }
    headers.set("Authorization", "Bearer " + accessToken);
    options.headers = headers;
    let response = await fetch(url, options);
    if (response.ok) {
        return (response);
    }
    else if (response.status === 401) {
        accessToken = await refreshToken();
        if (!accessToken)
            return (response);
        response = await FetchWithToken(url, options);
        return (response);
    }
    return (response);
}

// Function to convert the file to a Base64 string
export function convertFileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader(); // Create a file reader
        reader.onload = function() {
            const base64String = reader.result.split(',')[1]; // Get the Base64 string
            resolve(base64String);
        };
        reader.onerror = function(error) {
            reject(error);
        };
        reader.readAsDataURL(file); // Read the selected file as a data URL
    });
}

export async function sendFileToBackend(base64String) {

    await get_csrf_token();
    var csrftoken = getCookie('csrftoken');

    const jsonData = {
        profile_pic: base64String
    };

    var headers = new Headers();
    headers.append('X-CSRFToken', csrftoken);
    headers.append('Content-Type', 'application/json');

    // Send a POST request to the backend
    try {
        const response = await FetchWithToken("https://localhost:4241/authent/edit_avatar", {
            method: "POST",
            headers: headers,
            body: JSON.stringify(jsonData),
            credentials: 'include'
        });
        if (!response.ok) {
            alert("Couldn't upload file");
        }
    }
    catch(error) {
        alert(`Back end server error: ${error}`);
    }
}
