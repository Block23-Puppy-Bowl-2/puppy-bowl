const playerContainer = document.getElementById('all-players-container');
const newPlayerFormContainer = document.getElementById('new-player-form');

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
        const players = await response.json();
        return players;
    } catch (err) {
        console.error('Uh oh, trouble fetching players!', err);
    }
};

const fetchSinglePlayer = async (playerId) => {
    try {
        const requestOption = {
            method: 'GET'
        }
        const response = await fetch(`${APIURL}/${playerId}`);
        const player = await response.json();
        return player;
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
        const response = await fetch(`${APIURL}/${playerId}`);
        const player = await response.json();
        return player;
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
        
        //changing playerList to an array
        const players = Array.from(playerList);

        players.forEach((player) => {
          const playerElement = document.createElement('div');
        playerElement.classList.add('player');
        playerElement.innerHTML = `
        <h2>${player.id}</h2>
        <h2>${player.name}</h2>
        <h2>${player.breed}</h2>
        <h2>${player.status}</h2>
        <img src="${player.imageUrl}">
        <h2>${player.createdAt}</h2>
        <h2>${player.teadId}</h2>
        <h2>${player.cohortId}</h2>
        <button class="details-button" data-id="${player.id}">See Details</button>
        <button class="remove-button" data-id="${player.id}">Remove from roster</button>
        `;   
        playerContainer.appendChild(playerElement);

        // The event listeners are for the "See details"    
            const detailsButton = playerElement.querySelector('.detailts-button');
            detailsButton.addEventListener('click', async (event) => {
                //get id
                const playerId = event.target.dataset.id;
                //send API to renderfetchSinglePlayer
                fetchSinglePlayer(playerId);
            });
        // and "Remove from roster" buttons.
        const removeButton = playerElement.querySelector('.remove-button');
        removeButton.addEventListener('click', async (event) => {
            //get id
            const playerId = event.target.dataset.id;
            //send API to renderfetchSinglePlayer
            removePlayer(playerId);
            init()
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
        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            const playerObj = {
                //getting  player object values
            id: form.id.value,
            name: form.name.value,
            breed: form.breed.value,
            status: form.status.value,
            imageUrl: form.imageUrl.value,
            createdAt: form.createdAt.value,
            teamId: form.teadId.value,
            cohortId: form.cohortId.value
            };

            await addNewPlayer(playerObj);
            const players = await fetchAllPlayers();
            renderAllPlayers(players)
        });

        //create form field ->
        newPlayerFormContainer.appendChild(form);
    } catch (err) {
        console.error('Uh oh, trouble rendering the new player form!', err);
    }
}

const init = async () => {
    const players = await fetchAllPlayers();
    // console.log(players)
    renderAllPlayers(players);

    await renderNewPlayerForm();

}

init();