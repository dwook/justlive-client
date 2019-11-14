import React from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import './Header.scss';

function Header() {
  return (
    <div className="header">
      <div className="logo">Just Live</div>
      <Switch>
        <Route
          path="/book"
          render={() => {
            return (
              <button className="button">
                <Link to="/" exact>
                  메인으로
                </Link>
              </button>
            );
          }}
        />
        <Route
          path="/"
          render={() => {
            return (
              <button className="button">
                <Link to="/book" exact>
                  투어예약
                </Link>
              </button>
            );
          }}
        />
      </Switch>
    </div>
  );
}

export default Header;
