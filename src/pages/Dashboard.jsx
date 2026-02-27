function Dashboard() {
  return (
    <div>
      <h2 className="mb-4">Dashboard</h2>

      <div className="row">
        <div className="col-md-4">
          <div className="card text-bg-primary mb-3">
            <div className="card-body">
              <h5 className="card-title">Total Tickets</h5>
              <p className="card-text fs-3">120</p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card text-bg-success mb-3">
            <div className="card-body">
              <h5 className="card-title">Resolved</h5>
              <p className="card-text fs-3">95</p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card text-bg-danger mb-3">
            <div className="card-body">
              <h5 className="card-title">Pending</h5>
              <p className="card-text fs-3">25</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;