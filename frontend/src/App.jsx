import { useEffect, useState } from "react";
import AppRoutes from "./routes/AppRoutes";
import { SocketProvider } from "./context/SocketProvider";
import { issueActions } from "./store/issueStore";
import { useAuth } from "./context/AuthContext";
import { getMyIssues } from "./api/issueApi";

function App() {
  const { user } = useAuth();
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    if (!user || !user._id) return;

    const fetchIssues = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await getMyIssues(token);
        setIssues(res.data);
      } catch (error) {
        console.error("❌ Failed to fetch issues:", error);
      }
    };

    fetchIssues();
  }, [user?._id]);

  return (
    <SocketProvider
      user={user}
      issueActions={issueActions(setIssues)}
    >
      <AppRoutes issues={user ? issues : []} />
    </SocketProvider>
  );
}

export default App;
