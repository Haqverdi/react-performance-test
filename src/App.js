import React, { useState } from 'react';
import _ from 'lodash';
import classNames from 'classnames';

import './style.css';

const DAYS = _.range(1, 32).map(day => 'Oct ' + day);

function randomMilliseconds() {
  return Math.floor(Math.random() * 500);
}

const service = {
  cells: [],
  addCell(cell) {
    this.cells.push(cell);
  },
  searchAllCells() {
    for (let i = 0; i < this.cells.length; i++) {
      this.cells[i].search();
    }
  },
};

function Cell(props) {
  const { hour } = props;

  const [{ isSearching, searchResults }, setState] = useState({
    isSearching: false,
    searchResults: null,
  });

  function search() {
    setState({
      isSearching: true,
      searchResults: { options: null },
    });

    setTimeout(() => {
      setState({
        isSearching: false,
        searchResults: { options: Math.floor(Math.random() * 5) },
      });
    }, randomMilliseconds());
  }

  function clicked() {
    search();
  }

  service.addCell({ search });

  if (isSearching) {
    return (
      <td className="hour-cell">
        <div className="searching">...</div>
      </td>
    );
  } else if (searchResults) {
    const { options } = searchResults;
    const classes = classNames({
      'good-results': options > 3,
      'weak-results': options > 1 && options <= 3,
      'bad-results': options >= 0 && options <= 1,
    });

    return (
      <td className="hour-cell" onClick={clicked}>
        <div className={classes}>
          <div>{options}</div>
          <div className="result-label">results</div>
        </div>
      </td>
    );
  } else {
    return (
      <td className="hour-cell" onClick={clicked}>
        <div className="time">{hour}:00</div>
      </td>
    );
  }
}

function App() {
  const [isLoaded, setIsLoaded] = useState(false);

  function load() {
    setIsLoaded(true);
  }

  function searchAll() {
    service.searchAllCells();
  }

  return (
    <div className="main">
      <h3>React performance test!</h3>

      {isLoaded || (
        <button className="btn" onClick={load}>
          Load
        </button>
      )}
      {isLoaded && (
        <button className="btn" onClick={searchAll}>
          Search all month
        </button>
      )}
      {isLoaded && (
        <table>
          <tbody>
            <tr>
              {DAYS.map((day, index) => (
                <th className="day-header" key={`th${index}`}>
                  {day}
                </th>
              ))}
            </tr>
            {_.range(24).map((hour, index) => (
              <tr key={'tr' + index}>
                {DAYS.map((day, index) => {
                  return <Cell hour={hour} day={day} key={`cell${index}`} />;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
