import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import Router components
import UserSubmissionForm from './pages/UserSubmissionForm'; // Import your page/component
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>  {/* Wrap the app with Router */}
      <Routes>  {/* Define the routes */}
        <Route path="/" element={<UserSubmissionForm />} />
        <Route path="/admindashboard" element={<AdminDashboard/>} /> {/* Default route to render UserSubmissionForm */}
      </Routes>
    </Router>
  );
}

export default App;
