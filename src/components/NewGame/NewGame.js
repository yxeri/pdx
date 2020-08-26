import React, { useState } from 'react';
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

function NewGame() {
  const [name, setName] = useState();
  const [description, setDescription] = useState();
  const [tags, setTags] = useState();
  const [message, setMessage] = useState();
  const history = useHistory();

  async function submit() {
    if (!name || name === '') {
      setMessage('You must enter a name');

      return
    }

    try {
      const response = await fetch('http://127.0.0.1:8080/api/v1/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          tags,
        }),
      });

      if (!response.ok) {
        throw new Error('Unable to save game');
      }

      history.push('/');
    } catch (error) {
      setMessage(error.message || 'Failed to save game');
    }
  }

  return (
    <div
      className="new-component"
    >
      {message? <div className="message"><span>{message}</span></div> : <></>}
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

export default NewGame;
