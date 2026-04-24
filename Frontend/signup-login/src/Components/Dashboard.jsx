import { useEffect, useState } from "react";

function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/protected", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setUser(data);
      });
  }, []);

  if (!user) return <p>Loading...</p>;

  const handleLogout = () => {
  localStorage.removeItem("token");
  window.location.href = "/";
};

  return (
    <>
    <div>
      <h2>Welcome {user.username}</h2>
      <p>User ID: {user.id}</p>
    </div>
    <button onClick={handleLogout}>Logout</button>
  </>
  );
}

export default Dashboard;