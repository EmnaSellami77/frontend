function Tickets() {
  return (
    <div>
      <h2 className="mb-4">Liste des Tickets</h2>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Titre</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Problème réseau</td>
            <td><span className="badge bg-warning">En attente</span></td>
          </tr>
          <tr>
            <td>2</td>
            <td>Erreur serveur</td>
            <td><span className="badge bg-success">Résolu</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Tickets;