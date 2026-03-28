import React, { useState } from 'react';
import { authService } from '../services';

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  
  // État pour l'inscription
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupRole, setSignupRole] = useState('user');
  const [signupSuccess, setSignupSuccess] = useState('');

  // Connexion
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.login({ email, password });
      if (onLoginSuccess) {
        onLoginSuccess(response.user);
      }
    } catch (err) {
      setError(err.message || 'Email ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  // Inscription
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSignupSuccess('');

    try {
      await authService.signup({
        name: signupName,
        email: signupEmail,
        password: signupPassword,
        role: signupRole
      });
      setSignupSuccess('Compte créé avec succès ! Connectez-vous maintenant.');
      // Réinitialiser le formulaire et basculer vers connexion
      setTimeout(() => {
        setIsSignup(false);
        setSignupSuccess('');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h3 className="text-center mb-0">
                {isSignup ? 'Inscription' : 'Connexion'}
              </h3>
            </div>
            <div className="card-body">
              {error && (
                <div className="alert alert-danger">{error}</div>
              )}
              {signupSuccess && (
                <div className="alert alert-success">{signupSuccess}</div>
              )}

              {!isSignup ? (
                // Formulaire de connexion
                <form onSubmit={handleLogin}>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Mot de passe</label>
                    <input
                      type="password"
                      className="form-control"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={loading}
                  >
                    {loading ? 'Connexion...' : 'Se connecter'}
                  </button>
                </form>
              ) : (
                // Formulaire d'inscription
                <form onSubmit={handleSignup}>
                  <div className="mb-3">
                    <label className="form-label">Nom complet</label>
                    <input
                      type="text"
                      className="form-control"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Mot de passe</label>
                    <input
                      type="password"
                      className="form-control"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Rôle</label>
                    <select
                      className="form-control"
                      value={signupRole}
                      onChange={(e) => setSignupRole(e.target.value)}
                    >
                      <option value="user">Utilisateur</option>
                      <option value="developer">Développeur</option>
                      <option value="admin">Administrateur</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-success w-100"
                    disabled={loading}
                  >
                    {loading ? 'Inscription...' : "S'inscrire"}
                  </button>
                </form>
              )}

              <hr className="my-3" />
              
              <div className="text-center">
                <button
                  className="btn btn-link"
                  onClick={() => {
                    setIsSignup(!isSignup);
                    setError('');
                    setSignupSuccess('');
                  }}
                >
                  {isSignup
                    ? 'Déjà un compte ? Connectez-vous'
                    : 'Pas de compte ? Inscrivez-vous'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;