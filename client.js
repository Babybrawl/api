const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = 3000;
const apiKey = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6ImVhYjViZTFiLTUzMjEtNDM3Zi1hZDdjLWExYWIyNDhkZmQzNyIsImlhdCI6MTcwMjU3NDg5NCwic3ViIjoiZGV2ZWxvcGVyL2NkZDVlY2FkLTkxZmUtZWI1Mi0zZGM5LWEyNzZiYWNmMjFjNCIsInNjb3BlcyI6WyJicmF3bHN0YXJzIl0sImxpbWl0cyI6W3sidGllciI6ImRldmVsb3Blci9zaWx2ZXIiLCJ0eXBlIjoidGhyb3R0bGluZyJ9LHsiY2lkcnMiOlsiODguMTI1LjE0MC4xNDIiXSwidHlwZSI6ImNsaWVudCJ9XX0.JzEC187VmUsbG7pIqvmpxGMaSgkAncq0-on6HxkO2YgHYPHHAxOtaxG36p8l7gdPV7XJFxYU20xFw551sJnawA'; // Remplacez par votre clé d'API Brawl Stars

app.use(cors()); // Autoriser toutes les origines pour les requêtes CORS

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



app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

    app.use((req, res) => {
        res.json({message : "l'api est ok !"});
    });