import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SuperheroList from './components/SuperheroList';
import SuperheroDetail from './components/SuperheroDetail';
import SuperheroForm from './components/SuperheroForm';
import { SuperheroProvider } from './context/SuperheroContext';
import superheroImage from './the-top-10-greatest-superheroes-without-superpowers-in-comics-today.webp';
import './App.css';

function App() {
  return (
    <SuperheroProvider>
      <Router>
        <div className="App">
          <header className="App-header">
            <img src={superheroImage} alt="Superheroes" className="header-image" />
          </header>
          <main className="container">
            <Routes>
              <Route path="/" element={<SuperheroList />} />
              <Route path="/superhero/:id" element={<SuperheroDetail />} />
              <Route path="/superhero/new" element={<SuperheroForm />} />
              <Route path="/superhero/:id/edit" element={<SuperheroForm />} />
            </Routes>
          </main>
        </div>
      </Router>
    </SuperheroProvider>
  );
}

export default App;
