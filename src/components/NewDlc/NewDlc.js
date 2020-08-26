import React, { useEffect, useState } from 'react';
import {
  Select,
  Input,
  Button
} from 'antd';
import {
  Link,
  useHistory,
} from 'react-router-dom';

import '../commonStyles.css';

function NewDlc() {
  const [name, setName] = useState();
  const [gameId, setGameId] = useState();
  const [description, setDescription] = useState();
  const [tags, setTags] = useState();
  const [message, setMessage] = useState();
  const [games, setGames] = useState([]);
  const history = useHistory();

  async function submit() {
    if (!name || name === '') {
      setMessage('You must enter a name');

      return
    }

    if (!gameId) {
      setMessage('You must choose a game');

      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8080/api/v1/dlcs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          gameId,
          description,
          tags,
        }),
      });

      if (!response.ok) {
        throw new Error('Unable to save DLC');
      }

      history.push('/');
    } catch (error) {
      setMessage(error.message || 'Failed to save DLC');
    }
  }

  async function retrieveGames() {
    const response = await fetch('http://127.0.0.1:8080/api/v1/games');

    if (!response.ok) {
      throw new Error('Unable to retrieve games');
    }

    const json = await response.json();
    const { games } = json;

    setGames(games);
  }

  useEffect(() => {
    retrieveGames().catch(error => setMessage(error.message));
  }, []);

  return (
    <div
      className="new-component"
    >
      {message ? <div className="message"><span>{message}</span></div> : <></>}
      <Select
        showSearch
        placeholder="Select a game"
        onChange={setGameId}
      >
        {games.map(game => <Select.Option key={game._id} value={game._id}>{game.name}</Select.Option>)}
      </Select>
      <Input
        placeholder="Enter name"
        onChange={(event) => { setName(event.target.value); }}
      />
      <Input.TextArea
        placeholder="Enter description"
        rows={4}
        onChange={(event) => {setDescription(event.target.value); }}
      />
      <Select
        placeholder="Tags"
        mode="tags"
        onChange={setTags}
      />
      <div className="buttons">
        <Link to="/"><Button>Cancel</Button></Link>
        <Button
          onClick={submit}
        >
          Save
        </Button>
      </div>
    </div>
  )
}

export default NewDlc;
