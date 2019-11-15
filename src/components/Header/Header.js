import React from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import './Header.scss';
import logo from '../../assets/logo.jpg';

function Header() {
  return (
    <div className="header">
      <Link to="/">
        <img src={logo} className="logo" alt="justlive" />
      </Link>
      <Switch>
        <Route
          path="/"
          render={() => {
            return (
              <Link className="button" to="/book" exact="true">
                <span>투어예약</span>
              </Link>
            );
          }}
        />
        <Route
          path="/book"
          render={() => {
            return (
              <Link className="button" to="/">
                <span>메인으로</span>
              </Link>
            );
          }}
        />
      </Switch>
    </div>
  );
}

export default Header;
