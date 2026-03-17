// frontend/src/services/ticketService.js
const API_URL = 'http://localhost:5000'; // Ton backend Flask

export const predictTicketCategory = async (ticketText) => {
    try {
        const response = await fetch(`${API_URL}/predict`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: ticketText })
        });
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erreur API:', error);
        throw error;
    }
};