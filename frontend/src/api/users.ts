
const BASE_URL = 'http://localhost:3000';

export async function register(params: {
    username: string, 
    password: string,
}) {
    return fetch(BASE_URL + '/auth/signup', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
    }).then(response => response.json())
    .then(response => new Promise<void>((resolve, reject) => {
        if (response.ok) {
            resolve();
        } else if (response['statusCode'] === 417 && response['message'] === 'Username Taken') {
            reject(new Error("Username Taken."));
        }
    }));
}

export async function checkCurrentUser() {
    return fetch(BASE_URL + '/auth/checkUser', {
        method: 'GET',
        credentials: 'include',
        headers: {
            "Content-Type": "application/json",
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Username/Password not found.');
        }
    });
}

export async function checkUsername(username: string) {
    return fetch(BASE_URL + '/auth/checkUsername', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
    }).then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw Error("Username Taken.");
        }
    })
    .then(response => {
        if (!response.valid) {
            throw Error("Username Taken.");
        }
    });
}

export async function login(params: {
    username: string, 
    password: string,
}) {
    return fetch(BASE_URL + '/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Username/Password not found.');
        }
    });
}