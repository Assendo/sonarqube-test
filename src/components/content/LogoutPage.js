import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { userService } from '../../_services';

class LogoutPage extends React.Component {
    constructor() {
        super();
        userService.logout();
    }

    render(){
        return(
            <Route>
                <Redirect to="/"/>
            </Route>
        )
    }
}

export default LogoutPage;