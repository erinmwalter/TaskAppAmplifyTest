import { useAuthenticator } from '@aws-amplify/ui-react';

function Navbar() {
  const { signOut } = useAuthenticator((context) => [context.user]);

  return (
    <nav className="navbar navbar-light bg-light">
      <div className="container">
        <span className="navbar-brand">TaskApp</span>
        <button 
          onClick={signOut}
          className="btn btn-outline-secondary"
        >
          Sign Out
        </button>
      </div>
    </nav>
  );
}

export default Navbar;