// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import React from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';
import { Fabric } from 'office-ui-fabric-react';
import PropTypes from 'prop-types';

import MarketList from './market_list/market_list';
import MarketDetail from './market_detail/market_detail';
import CheckList from './check_list/check_list';

const App = props => {
  const { api, user, token, isAdmin } = props;

  return (
    <Router>
      <Route
        path='/'
        exact
        render={props => (
          <MarketList
            api={api}
            user={user}
            token={token}
            isAdmin={isAdmin}
            routeProps={props}
          />
        )}
      />
      <Route
        path={`/market_detail`}
        exact
        render={props => (
          <MarketDetail
            api={api}
            user={user}
            token={token}
            isAdmin={isAdmin}
            routeProps={props}
          />
        )}
      />
    </Router>
  );
};

App.propTypes = {
  api: PropTypes.string,
  user: PropTypes.string,
  token: PropTypes.string,
  isAdmin: PropTypes.bool,
};

export default App;