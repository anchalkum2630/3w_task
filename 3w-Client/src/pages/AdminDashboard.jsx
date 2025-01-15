import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch user submissions data from backend
    axios.get('http://localhost:5000/api/dashboard')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>User Submissions Dashboard</h1>
      
      {users.length === 0 ? (
        <p>No user submissions found.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f4f4f4' }}>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Name</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Social Media Handle</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Uploaded Files</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.name}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                  {user.social_media_handle}
                </td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                  {user.files.length === 0 ? (
                    <span>No files uploaded</span>
                  ) : (
                    <div>
                      {user.files.map((file, index) => (
                        <div key={index} style={{ marginBottom: '10px' }}>
                          <a
                            href={`http://localhost:5000/${file.path}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <img
                              src={`http://localhost:5000/${file.path}`}
                              alt={file.filename}
                              style={{ width: '80px', marginRight: '10px', cursor: 'pointer' }}
                            />
                          </a>
                          <span>{file.filename} (Size: {file.size} bytes)</span>
                        </div>
                      ))}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminDashboard;
