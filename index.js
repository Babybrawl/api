const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = 3000;
const apiKey = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6ImVhYjViZTFiLTUzMjEtNDM3Zi1hZDdjLWExYWIyNDhkZmQzNyIsImlhdCI6MTcwMjU3NDg5NCwic3ViIjoiZGV2ZWxvcGVyL2NkZDVlY2FkLTkxZmUtZWI1Mi0zZGM5LWEyNzZiYWNmMjFjNCIsInNjb3BlcyI6WyJicmF3bHN0YXJzIl0sImxpbWl0cyI6W3sidGllciI6ImRldmVsb3Blci9zaWx2ZXIiLCJ0eXBlIjoidGhyb3R0bGluZyJ9LHsiY2lkcnMiOlsiODguMTI1LjE0MC4xNDIiXSwidHlwZSI6ImNsaWVudCJ9XX0.JzEC187VmUsbG7pIqvmpxGMaSgkAncq0-on6HxkO2YgHYPHHAxOtaxG36p8l7gdPV7XJFxYU20xFw551sJnawA';

// Configuration du CORS pour autoriser les requêtes provenant de votre domaine local
app.use(cors({ origin: 'http://localhost:3000' }));

// Middleware pour ajouter les en-têtes CORS à toutes les réponses
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// Route pour récupérer les informations d'un joueur
app.get('/:playerTag', async (req, res) => {
    const playerTag = req.params.playerTag;

    try {
        const playerData = await getPlayerInfo(playerTag, apiKey);
        res.json(playerData);
    } catch (error) {
        console.error('Erreur:', error.message);
        res.status(500).send('Erreur Interne du Serveur');
    }
});

// Route pour récupérer les informations d'un club
app.get('/clubs/:clubTag', async (req, res) => {
    const clubTag = req.params.clubTag;
    
    try {
        const clubData = await getClubInfo(clubTag, apiKey);
        res.json(clubData);
    } catch (error) {
        console.error('Erreur lors de la récupération des informations du club:', error.message);
        res.status(500).send('Erreur Interne du Serveur');
    }
});

// Route pour récupérer l'historique des combats d'un joueur
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

// Fonction pour récupérer les informations d'un joueur
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
        throw new Error(`Erreur API: ${response.status} - ${response.statusText}`);
    }
}

// Fonction pour récupérer les informations d'un club
async function getClubInfo(clubTag, apiKey) {
    const url = `https://api.brawlstars.com/v1/clubs/%23${clubTag}`;
    const headers = {
        'Accept': 'application/json',
        'Authorization': `Bearer ${apiKey}`
    };

    const response = await axios.get(url, { headers });

    if (response.status === 200) {
        return response.data;
    } else {
        throw new Error(`Erreur API: ${response.status} - ${response.statusText}`);
    }
}

// Fonction pour récupérer l'historique des combats d'un joueur
async function recupererHistoriqueCombatJoueur(playerTag, apiKey) {
    const url = `https://api.brawlstars.com/v1/players/%23${playerTag}/battlelog`;
    const headers = {
        'Accept': 'application/json',
        'Authorization': `Bearer ${apiKey}`
    };

    const response = await axios.get(url, { headers });

    if (response.status === 200) {
        return response.data;
    } else {
        throw new Error(`Erreur API: ${response.status} - ${response.statusText}`);
    }
}

// Middleware pour gérer les routes non trouvées
app.use((req, res) => {
    res.status(404).send('Page Non Trouvée');
});

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Serveur en cours d'écoute sur le port ${port}`);
});
