import React from 'react';
import './DropdownStyle.css';


class Dropdown extends React.Component {
    constructor() {
        super();

        this.state = {
            displayMenu: false,
        };

        this.showDropdownMenu = this.showDropdownMenu.bind(this);
        this.hideDropdownMenu = this.hideDropdownMenu.bind(this);

    };

    showDropdownMenu(event) {
        event.preventDefault();
        this.setState({ displayMenu: true }, () => {
            document.addEventListener('click', this.hideDropdownMenu);
        });
    }

    hideDropdownMenu() {
        this.setState({ displayMenu: false }, () => {
            document.removeEventListener('click', this.hideDropdownMenu);
        });

    }

    render() {

        /* 
            <li className="liSty"><a className="active" href="#Create Page">Create Page</a></li>
                        <li className="liSty"><a href="#Manage Pages">Manage Pages</a></li>
                        <li className="liSty"><a href="#Create Ads">Create Ads</a></li>
                        <li className="liSty"><a href="#Manage Ads">Manage Ads</a></li>
                        <li className="liSty"><a href="#Activity Logs">Activity Logs</a></li>
                        <li className="liSty"><a href="#Setting">Setting</a></li>
                        <li className="liSty"><a href="#Log Out">Log Out</a></li>
                        */
        return (
            <div className="dropdownSty" style={{ background: "red", width: "40px" }} >
                <div className="button" onClick={this.showDropdownMenu}></div>

                {this.state.displayMenu ? (
                    <ul className="ulSty">

                        {
                            this.props.perfiles.map((perfil, i) => (
                                <li className="liSty">
                                    <button className="butSty" onClick={() => this.props.ElijeEnDropdown(this.props.nombre, perfil.codigo, perfil.descripcion)}>
                                        {perfil.descripcion}
                                    </button>
                                </li>
                            ))}

                    </ul>
                ) :
                    (
                        null
                    )
                }

            </div>

        );
    }


}

export default Dropdown;
