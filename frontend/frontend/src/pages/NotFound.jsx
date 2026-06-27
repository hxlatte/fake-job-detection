import React from "react";
import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <div className="section-container notfound-wrapper page-fade-in">
      <div className="notfound-code">404</div>
      <h3>Threat Registry Mismatch</h3>
      <p>
        The request coordinates did not return any valid address record inside the heuristic scanner files. Return back to secure pathways.
      </p>
      <Link to="/" className="btn btn-primary btn-ripple mt-3">
        Back to Dashboard
      </Link>
    </div>
  );
}
