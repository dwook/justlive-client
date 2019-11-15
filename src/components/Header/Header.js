import React from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import './Header.scss';
import logo from '../../assets/logo.jpg';

function Header() {
  return (
    <div className="header">
      <img src={logo} className="logo" alt="justlive" />
      <Switch>
        <Route
          path="/"
          render={() => {
            return (
              <span className="button">
                <Link to="/book" exact="true">
                  투어예약
                </Link>
              </span>
            );
          }}
        />
        <Route
          path="/book"
          render={() => {
            return (
              <span className="button">
                <Link to="/">메인으로</Link>
              </span>
            );
          }}
        />
      </Switch>
    </div>
  );
}

export default Header;
