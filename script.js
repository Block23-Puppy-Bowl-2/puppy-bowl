const playerContainer = document.querySelector('#all-players-container');
const newPlayerFormContainer = document.querySelector('#new-player-form');

// Add your cohort name to the cohortName variable below, replacing the 'COHORT-NAME' placeholder
const cohortName = '2302-ACC-PT-WEB-PT-A';
// Use the APIURL variable for fetch requests
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/2302-ACC-PT-WEB-PT-A/players`;

/**
 * It fetches all players from the API and returns them
 * @returns An array of objects.
 */
const fetchAllPlayers = async () => {
    try {
        const response = await fetch(APIURL);
        const data = await response.json();

        if (!Array.isArray(data.data.players)) {
        console.warn('Uh oh, fetched player data is not an array!', data);
        return [];
      }

      return data.data.players;
    } catch (err) {
      console.error('Uh oh, trouble fetching players!', err);
      return [];
    }
  };


const fetchSinglePlayer = async (playerId) => {
    try {
        const requestOption = {
            method: 'DELETE'
        }
        const response = await fetch(`${APIURL}/${playerId}`);
        const players = await response.json();
        return players;
    } catch (err) {
        console.error(`Oh no, trouble fetching player #${playerId}!`, err);
    }
};

const addNewPlayer = async (playerObj) => {
    try {
        const requestOption = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(playerObj)
        };
        const response = await fetch(APIURL, requestOption);
        const newPlayer = await response.json();
        return newPlayer;
    } catch (err) {
        console.error('Oops, something went wrong with adding that player!', err);
    }
};

const removePlayer = async (playerId) => {
    try {
      const requestOption = {
        method: 'DELETE',
      };
      const response = await fetch(`${APIURL}/${playerId}`, requestOption);
      const players = await response.json();
      return players;
    } catch (err) {
      console.error(
        `Whoops, trouble removing player #${playerId} from the roster!`,
        err
      );
    }
};

/**
 * It takes an array of player objects, loops through them, and creates a string of HTML for each
 * player, then adds that string to a larger string of HTML that represents all the players. 
 * 
 * Then it takes that larger string of HTML and adds it to the DOM. 
 * 
 * It also adds event listeners to the buttons in each player card. 
 * 
 * The event listeners are for the "See details" and "Remove from roster" buttons. 
 * 
 * The "See details" button calls the `fetchSinglePlayer` function, which makes a fetch request to the
 * API to get the details for a single player. 
 * 
 * The "Remove from roster" button calls the `removePlayer` function, which makes a fetch request to
 * the API to remove a player from the roster. 
 * 
 * The `fetchSinglePlayer` and `removePlayer` functions are defined in the
 * @param playerList - an array of player objects
 * @returns the playerContainerHTML variable.
 */
const renderAllPlayers = async (playerList) => {
    try {
      playerContainer.innerHTML = '';

      if (!Array.isArray(playerList)) {
        console.warn('Uh oh, playerList is not an array!', playerList);
        return;
      }

      playerList.forEach((player) => {
        const playerElement = document.createElement('div');
        playerElement.classList.add('player');
        playerElement.innerHTML = `
          <h2>ID: ${player.id}</h2>
          <h2>Name: ${player.name}</h2>
          <h2>Breed: ${player.breed}</h2>
          <h2 class="hidden">Status: ${player.status}</h2>
          <img src="${player.imageUrl}">
          <h2 class="hidden">Created At: ${player.createdAt}</h2>
          <h2>Team ID: ${player.teamId}</h2>
          <h2 class="hidden">Cohort ID: ${player.cohortId}</h2>
          <button class="details-button" data-id="${player.id}">See Details</button>
          <button class="remove-button" data-id="${player.id}">Remove from roster</button>
          `;
        playerContainer.appendChild(playerElement);

        //hide element with class "hidden"
        let hiddenElements = playerElement.querySelectorAll('.hidden');
        hiddenElements.forEach((element) => {
          element.style.display = 'none';
        });

        // The event listeners for the "See details" and "Remove from roster"
        const detailsButton = playerElement.querySelector('.details-button');
        const removeButton = playerElement.querySelector('.remove-button');

        detailsButton.addEventListener('click', async (event) => {
          const playerId = event.target.dataset.id;
          const player = await fetchSinglePlayer(playerId);
          if (player) {
            //display the details
            let hiddenElements = playerElement.querySelectorAll('.hidden');
            hiddenElements.forEach((element) => {
                if (element.style.display === 'none') {
                    element.style.display = '';
                } else {
                    element.style.display = 'none'
                }
            });
          }

        });

        removeButton.addEventListener('click', async (event) => {
          const playerId = event.target.dataset.id;
          await removePlayer(playerId);
          init(); // re-render all players after deleting one
        });
      });
    } catch (err) {
      console.error('Uh oh, trouble rendering players!', err);
    }
  };


/**
 * It renders a form to the DOM, and when the form is submitted, it adds a new player to the database,
 * fetches all players from the database, and renders them to the DOM.
 */
const renderNewPlayerForm = async () => {
    try {
        const form = document.createElement('form');
        
        // create input fields for the form
        form.innerHTML = `
            <label>
                ID:
                <input type="text" name="id">
            </label>
            <label>
                Name:
                <input type="text" name="name">
            </label>
            <label>
                Breed:
                <input type="text" name="breed">
            </label>
            <label>
                Status:
                <input type="text" name="status">
            </label>
            <label>
                Image URL:
                <input type="text" name="imageUrl">
            </label>
            <label>
                Created At:
                <input type="text" name="createdAt">
            </label>
            <label>
                Team ID:
                <input type="text" name="teamId">
            </label>
            <label>
                Cohort ID:
                <input type="text" name="cohortId">
            </label>
            <button type="submit">Add Player</button>
        `
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            const playerObj = {
                id: form.id.value,
                name: form.name.value,
                breed: form.breed.value,
                status: form.status.value,
                imageUrl: form.imageUrl.value,
                createdAt: form.createdAt.value,
                teamId: form.teamId.value,
                cohortId: form.cohortId.value
            };
            
            // Validate the playerObj before adding to the database
            
            await addNewPlayer(playerObj);
            
            // re-fetch all players and render them again
            const players = await fetchAllPlayers();
            renderAllPlayers(players)
        });

        newPlayerFormContainer.appendChild(form);
    } catch (err) {
        console.error('Uh oh, trouble rendering the new player form!', err);
    }
}



const init = async () => {
    const players = await fetchAllPlayers();
    console.log(players)
    renderAllPlayers(players);

    

}
renderNewPlayerForm(); //put it outside the function so that it wont duplicate addNewPLayer form.

init();