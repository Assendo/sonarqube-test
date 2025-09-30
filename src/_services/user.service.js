import { authHeader } from '../_helpers';

export const userService = {
    login,
    logout
};

function login(username, password) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    };

    //return fetch(`http://localhost:4000/users/authenticate`, requestOptions) //Desarrollo Assendo. Comentar al pasar a banco PBN
    return fetch('http://localhost:8080/sta/application/activedirectory/authenticate/'+username+'/'+password, requestOptions)
        .then(handleResponse)
        .then(user => {
             // login successful if there's a user in the response
             // store user details and basic auth credentials in local storage 
             // to keep user logged in between page refreshes
             user.authdata = window.btoa(username + ':' + password);
             localStorage.setItem('user', JSON.stringify(user));
             return user;
        });
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
    localStorage.removeItem('token');
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                logout();
                window.location.reload(true);
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}