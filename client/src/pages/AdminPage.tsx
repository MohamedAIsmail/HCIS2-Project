import * as React from 'react';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import styles from "./css/admin-page.module.css";
import IconButton from '@mui/material/IconButton';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

type UserData = {
  id: number;
  name: string;
  role: string;
  email: string;
  password: string;
};

export default function Admin() {
  const [data, setData] = useState<UserData[]>([
    { id: 1, name: "John Doe", role: "Admin", email: "john@example.com", password: "password1" },
    { id: 2, name: "Jane Smith", role: "Moderator", email: "jane@example.com", password: "password2" }
    // Add more dummy data as needed
  ]);

  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleDelete = (id: number) => {
    const updatedData = data.filter(item => item.id !== id);
    setData(updatedData);
  };

  const filteredData = data.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <React.Fragment>
      <header>
        <h1>Admin Control Panel</h1>

      </header>
      <div style={{display:"flex"}}>
      <IconButton  aria-label="logout " style={{ backgroundColor: '#7c73e6',color:'black' }}>
              <ExitToAppIcon />
            </IconButton>
      <TextField
      style={{ width: '100%', alignItems: 'center',height: '40px'}}
            margin="normal"
            type="text"
            placeholder="Search by name or email"
            value={searchTerm}
            onChange={handleSearchChange}
            variant="outlined"
          />

      </div>

      <div className={styles.panel}>
        <div className={styles['admin-container']}>
          <table >
            <thead>
              <tr>
                <th>id</th>
                <th>Name</th>
                <th>Email</th>
                <th id="EditPassword">Password</th>
                <th></th>
                <th id="lastcol"></th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>{item.password}</td>
                  <td><button onClick={() => handleDelete(item.id)}>Delete</button></td>
                  <td></td>
                </tr>
              ))}
              <tr>
                <td colSpan={6}>
                  <div className={styles['btn add-new']}>
                    <button id="addAdminButton" value="">
                      <a href="./AddDoctor" style={{ textDecoration: 'none', color: 'white' }}>
                        Add Doctor
                      </a>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

        </div>
      </div>
    </React.Fragment>
  );
}
