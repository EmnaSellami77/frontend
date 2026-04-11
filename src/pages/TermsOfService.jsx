import React from "react";
import { useNavigate } from "react-router-dom";

export default function TermsOfService() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <button onClick={() => navigate(-1)} style={styles.backButton}>
          ← Retour
        </button>
        <h1 style={styles.title}>Conditions d'utilisation</h1>
        <p style={styles.lastUpdated}>Dernière mise à jour : 11 avril 2026</p>

        <div style={styles.content}>
          <h2>1. Acceptation des conditions</h2>
          <p>
            En accédant et en utilisant la plateforme IT Support System (ci-après "la Plateforme"),
            vous acceptez d'être lié par les présentes conditions d'utilisation. Si vous n'acceptez
            pas ces conditions, veuillez ne pas utiliser la Plateforme.
          </p>

          <h2>2. Description du service</h2>
          <p>
            La Plateforme est un système de gestion de tickets IT qui permet aux consultants IT
            et aux développeurs de créer, suivre, modifier et résoudre des tickets d'incidents.
            La Plateforme utilise l'intelligence artificielle pour classifier automatiquement les
            tickets et suggérer des priorités.
          </p>

          <h2>3. Comptes utilisateurs</h2>
          <p>
            Pour utiliser la Plateforme, vous devez créer un compte. Vous êtes responsable de la
            confidentialité de vos identifiants et de toutes les activités effectuées sous votre
            compte. Vous devez fournir des informations exactes et complètes lors de l'inscription.
          </p>

          <h2>4. Comportement acceptable</h2>
          <p>
            Vous acceptez de ne pas utiliser la Plateforme pour :<br/>
            - Envoyer du contenu illégal, nuisible, diffamatoire ou abusif.<br/>
            - Tenter d'accéder sans autorisation à d'autres comptes ou données.<br/>
            - Perturber ou endommager le fonctionnement de la Plateforme.
          </p>

          <h2>5. Données personnelles</h2>
          <p>
            Vos données personnelles sont traitées conformément à notre politique de confidentialité.
            Nous collectons votre nom, email et les tickets que vous créez pour fournir le service.
          </p>

          <h2>6. Propriété intellectuelle</h2>
          <p>
            Tous les contenus de la Plateforme (textes, logos, code, etc.) sont la propriété de
            CAP Enterprise ou de ses concédants. Vous n'êtes pas autorisé à les reproduire sans
            autorisation.
          </p>

          <h2>7. Limitation de responsabilité</h2>
          <p>
            La Plateforme est fournie "en l'état". Nous ne garantissons pas son fonctionnement
            ininterrompu ou sans erreur. En aucun cas nous ne pourrions être tenus responsables
            des dommages indirects liés à l'utilisation de la Plateforme.
          </p>

          <h2>8. Modification des conditions</h2>
          <p>
            Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications
            prendront effet dès leur publication sur cette page.
          </p>

          <h2>9. Contact</h2>
          <p>
            Pour toute question relative à ces conditions, veuillez nous contacter à :
            support@itsupportsystem.com
          </p>
        </div>

        <button onClick={() => navigate(-1)} style={styles.closeButton}>
          Fermer
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f0f4ff 0%, #fafafa 100%)",
    padding: "40px 20px",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  card: {
    maxWidth: 800,
    margin: "0 auto",
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: "40px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
    position: "relative",
  },
  backButton: {
    background: "none",
    border: "none",
    fontSize: "1rem",
    color: "#3b82f6",
    cursor: "pointer",
    marginBottom: "20px",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    fontWeight: 500,
  },
  title: {
    fontSize: "2rem",
    fontWeight: 700,
    color: "#0f172a",
    marginBottom: "8px",
  },
  lastUpdated: {
    color: "#64748b",
    fontSize: "0.85rem",
    marginBottom: "30px",
    borderBottom: "1px solid #e2e8f0",
    paddingBottom: "10px",
  },
  content: {
    color: "#1e293b",
    lineHeight: 1.6,
    fontSize: "1rem",
  },
  contentH2: {
    fontSize: "1.3rem",
    fontWeight: 600,
    marginTop: "24px",
    marginBottom: "12px",
    color: "#0f172a",
  },
  closeButton: {
    marginTop: "30px",
    padding: "12px 24px",
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: 600,
    width: "100%",
    transition: "background 0.2s",
  },
};

// Appliquer les styles pour les h2
const style = document.createElement('style');
style.textContent = `
  h2 {
    font-size: 1.3rem;
    font-weight: 600;
    margin-top: 24px;
    margin-bottom: 12px;
    color: #0f172a;
  }
`;
document.head.appendChild(style);