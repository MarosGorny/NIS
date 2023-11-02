import { useEffect } from 'react';
import { useNavigate } from 'react-router';
export default function Logout() {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('logged-user');
    if (token != null) {
      const headers = { authorization: 'Bearer ' + token };
      fetch('/auth/logout', { headers });
      localStorage.removeItem('logged-user');
    }
    navigate('/login');
    window.location.reload();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
}
