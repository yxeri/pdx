import {
  Input,
  List,
  Menu,
} from 'antd';
import React, {
  useEffect,
  useState,
} from 'react';
import './GamesList.css';

function GamesList() {
  const [selectedGame, setSelectedGame] = useState();
  const [games, setGames] = useState([]);


  const [search, setSearch] = useState();
  const [message, setMessage] = useState();

  async function retrieveGames() {
    const url = `http://127.0.0.1:8080/api/v1/games${search ? `?name=${search}&tags=${search}` : ''}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Unable to retrieve games');
    }

    const json = await response.json();
    const { games } = json;

    setGames(games);
  }

  useEffect(() => {
    retrieveGames().catch(error => setMessage(error.message));
  }, [search]);

  return (
    <div className="games-list">
      {message ? <div className="message"><span>{message}</span></div> : <></>}
      <Input
        className="search"
        placeholder="Search games by tag or name"
        onChange={(event) => { setSearch(event.target.value); }}
      />
      <Menu
        mode="inline"
        theme="dark"
        className="games"
      >
        {
          games.map((game) => {
            return <Menu.Item
              key={game._id}
              onClick={(clicked) => {
                window.scrollTo(0, 0);
                setSelectedGame(clicked.key);
              }}
            >
              {game.name}
            </Menu.Item>;
          })
        }
      </Menu>
      <List
        className="dlcs"
      >
        {
          selectedGame
            ? games
              .find(game => game._id === selectedGame)
              .dlcs
              .map((dlc) => {
                return <List.Item
                  key={dlc._id}
                  className="dlc"
                >
                  <span>{dlc.name}</span>
                  <span>{dlc.description}</span>
                  <span>Tags: {dlc.tags.join(', ')}</span>
                </List.Item>;
              })
            : <></>
        }
      </List>
    </div>
  );
}

export default GamesList;
