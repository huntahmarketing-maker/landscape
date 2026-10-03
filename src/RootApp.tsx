import App from './App';
import AdminApp from './AdminApp';

export default function RootApp() {
  return window.location.pathname === '/admin' ? <AdminApp /> : <App />;
}
