import React, { useState } from 'react';
import { ticketService, authService } from '../services';

function CreateTicket({ onTicketCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await ticketService.predict({
        title,
        description,
        priority,
        userId: authService.getUserId()
      });
      setResult(response);
      // Réinitialiser le formulaire
      setTitle('');
      setDescription('');
      setPriority('medium');
      if (onTicketCreated) {
        onTicketCreated(response);
      }
    } catch (err) {
      setError(err.message || 'Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card shadow">
      <div className="card-header bg-success text-white">
        <h4 className="mb-0">📝 Créer un ticket</h4>
      </div>
      <div className="card-body">
        {error && (
          <div className="alert alert-danger">{error}</div>
        )}
        
        {result && (
          <div className="alert alert-success">
            <h5>✓ Ticket créé avec succès !</h5>
            <hr />
            <p><strong>ID:</strong> {result.ticket_id}</p>
            <p><strong>Catégorie:</strong> {result.category}</p>
            <p><strong>Confiance IA:</strong> {(result.confidence * 100).toFixed(1)}%</p>
            <p><strong>Statut:</strong> {result.status}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Titre</label>
            <input
              type="text"
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Problème d'imprimante"
              required
            />
          </div>
          
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez votre problème en détail..."
              required
            />
          </div>
          
          <div className="mb-3">
            <label className="form-label">Priorité</label>
            <select
              className="form-control"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="low">🟢 Basse</option>
              <option value="medium">🟡 Moyenne</option>
              <option value="high">🟠 Haute</option>
              <option value="critical">🔴 Critique</option>
            </select>
          </div>
          
          <button
            type="submit"
            className="btn btn-success w-100"
            disabled={loading}
          >
            {loading ? '🤖 Classification en cours...' : '🚀 Créer le ticket'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateTicket;