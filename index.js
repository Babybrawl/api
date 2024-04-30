const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = 3000;
const apiKey = 'YOUR_API_KEY_HERE';

// Configuration du CORS pour autoriser les requêtes provenant de votre domaine local
app.use(cors({ origin: 'http://localhost' }));

// Vos autres middlewares et routes

app.listen(port, () => {
    console.log(`Serveur en cours d'écoute sur le port ${port}`);
});

app.get('/:playerTag', async (req, res) => {
    const playerTag = req.params.playerTag;

    try {
        const playerData = await getPlayerInfo(playerTag, apiKey);
        res.json(playerData);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/clubs/:clubTag', async (req, res) => {
    const clubTag = req.params.clubTag;
    
    try {
        const clubData = await getClubInfo(clubTag, apiKey);
        res.json(clubData);
    } catch (error) {
        console.error('Error fetching club data:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/joueur/:playerTag', async (req, res) => {
    const playerTag = req.params.playerTag;
    try {
        const historiqueCombat = await recupererHistoriqueCombatJoueur(playerTag, apiKey);
        res.json(historiqueCombat);
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'historique des combats:', error.message);
        res.status(500).json({ error: 'Erreur lors de la récupération de l\'historique des combats' });
    }
});


async function recupererHistoriqueCombatJoueur(playerTag, apiKey) {
    const url = `https://api.brawlstars.com/v1/players/%23${playerTag}/battlelog`;
    const headers = {
        'Accept': 'application/json',
        'Authorization': `Bearer ${apiKey}`
    };

    try {
        const reponse = await axios.get(url, { headers });

        if (reponse.status === 200) {
            return reponse.data;
        } else {
            throw new Error(`Erreur API: ${reponse.status} - ${reponse.statusText}`);
        }
    } catch (erreur) {
        throw new Error(`Erreur lors de la de l'historique des combats: ${erreur.message}`);
    }
}


async function getPlayerInfo(playerTag, apiKey) {
    const url = `https://api.brawlstars.com/v1/players/%23${playerTag}`;
    const headers = {
        'Accept': 'application/json',
        'Authorization': `Bearer ${apiKey}`
    };

    const response = await axios.get(url, { headers });

    if (response.status === 200) {
        return response.data;
    } else {
        throw new Error(`API Error: ${response.status} - ${response.statusText}`);
    }
}

async function getClubInfo(clubTag, apiKey) {
    const url = `https://api.brawlstars.com/v1/clubs/%23${clubTag}`; // Utilisation correcte du clubTag dans l'URL
    const headers = {
        'Accept': 'application/json',
        'Authorization': `Bearer ${apiKey}`
    };

    try {
        const response = await axios.get(url, { headers });

        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error(`API Error: ${response.status} - ${response.statusText}`);
        }
    } catch (error) {
        throw new Error(`Error fetching club data: ${error.message}`);
    }
}

app.use((req, res) => {
    res.json({message: "L'API fonctionne correctement !"});
});
