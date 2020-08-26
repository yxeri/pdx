export async function retrieveGames() {
  const response = await fetch('http://127.0.0.1:8080/api/v1/games');

  if (!response.ok) {
    throw new Error('Unable to retrieve games');
  }

  const json = await response.json();
  const { games } = json;

  return games;
}
