import React, { useState } from "react";

function Tickets() {

  // Données simulées (frontend uniquement)
  const [tickets] = useState([
    {
      id: 1,
      titre: "Problème réseau",
      utilisateur: "Ahmed",
      dateCreation: "2026-03-03T14:32:00",
      priorite: "Haute",
      scoreConfiance: 0.92,
      status: "En attente"
    },
    {
      id: 2,
      titre: "Erreur serveur",
      utilisateur: "Sara",
      dateCreation: "2026-03-02T10:15:00",
      priorite: "Moyenne",
      scoreConfiance: 0.75,
      status: "Résolu"
    },
    {
      id: 3,
      titre: "Installation logiciel",
      utilisateur: "Youssef",
      dateCreation: "2026-03-01T09:20:00",
      priorite: "Basse",
      scoreConfiance: 0.60,
      status: "En attente"
    }
  ]);

  // ✅ State pour la recherche
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ Filtrage des tickets
  const filteredTickets = tickets.filter((ticket) =>
    ticket.utilisateur.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fonctions couleur priorité
  const getPriorityColor = (priorite) => {
    switch (priorite) {
      case "Haute":
        return "bg-danger";
      case "Moyenne":
        return "bg-warning text-dark";
      case "Basse":
        return "bg-success";
      default:
        return "bg-secondary";
    }
  };

  // Couleur score IA
  const getScoreColor = (score) => {
    if (score > 0.8) return "bg-success";
    if (score > 0.5) return "bg-warning text-dark";
    return "bg-danger";
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Liste des Tickets</h2>

      {/* ✅ Barre de recherche */}
      <div className="mb-3 text-end">
        <input
          type="text"
          className="form-control w-25 d-inline"
          placeholder="Rechercher par nom utilisateur..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <table className="table table-striped table-bordered shadow-sm">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Titre</th>
            <th>Utilisateur</th>
            <th>Date</th>
            <th>Priorité</th>
            <th>Score IA</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {filteredTickets.map((ticket) => (
            <tr key={ticket.id}>
              <td>{ticket.id}</td>
              <td>{ticket.titre}</td>
              <td>{ticket.utilisateur}</td>

              <td>
                {new Date(ticket.dateCreation).toLocaleString()}
              </td>

              <td>
                <span className={`badge ${getPriorityColor(ticket.priorite)}`}>
                  {ticket.priorite}
                </span>
              </td>

              <td>
                <span className={`badge ${getScoreColor(ticket.scoreConfiance)}`}>
                  {(ticket.scoreConfiance * 100).toFixed(1)}%
                </span>
              </td>

              <td>
                <span
                  className={`badge ${
                    ticket.status === "Résolu"
                      ? "bg-success"
                      : "bg-warning text-dark"
                  }`}
                >
                  {ticket.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Tickets;