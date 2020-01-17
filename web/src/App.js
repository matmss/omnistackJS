import React, { useState, useEffect } from 'react';

import './Global.css'
import './App.css'
import './Sidebar.css'
import './Main.css'

function App() {
const [github_username, setGithubUsername] = useState('');
const [techs, setTechs] = useState(''); 

const [latitude, setLatitude] = useState('');
const [longitude, setLongitude] = useState('');
   
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitutde, longitude } = position.coords;

        setLatitude(latitude);
        setLongitude(longitude);
      },
      (err) => {
        console.log(err);
      },
      {
        timeout: 30000,
      }
    )
  }, []);

  async function handleAddDev(e) {
    e.preventDefault();

    
  }

  return (
    <div id-="app">
      <aside>
        <strong>Cadastro</strong>
        <form>
          <div className="input-block">
            <label htmlFor="github_username">Usuário GitHub</label>
            <input name="github_username" id="github_username" required value={github_username} onChange={e => setGithubUsername(e.target.value)} />
          </div>
          
          <div className="input-block">
            <label htmlFor="techs">Tecnologias</label>
            <input name="techs" id="techs" required value={techs} onChange={e => setTechs(e.target.value)} />
          </div>

          <div className="input-group">
            <div class="input-block">
              <label htmlFor="latitude">Latitude</label>
              <input name="latitude" id="latitude" required value={latitude} onChange={e => setLatitude(e.target.value)} />
            </div>

            <div className="input-block">
              <label htmlFor="longitude">Longitude</label>
              <input name="longitude" id="longitude" required value={longitude} onChange={e => setLongitude(e.target.value)} />
            </div>
          </div>

          <button type="submit">Salvar</button>
        </form>
      </aside>

      <main>
        <ul>
          <li class="dev-item">
            <header>
              <img src="https://avatars1.githubusercontent.com/u/26112787?s=460&v=4" alt="Matheus Santos"/>
              <div className="user-info">
                <strong>Matheus Santos</strong>
                <span>ReactJS, React Native, NodeJS</span>
              </div>
            </header>
            <p>Tell us a little bit about yourself</p>
            o<a href="https://github.com/matmss">Acessar Perfil no GitHub</a>
          </li>
          <li class="dev-item">
            <header>
              <img src="https://avatars1.githubusercontent.com/u/26112787?s=460&v=4" alt="Matheus Santos"/>
              <div className="user-info">
                <strong>Matheus Santos</strong>
                <span>ReactJS, React Native, NodeJS</span>
              </div>
            </header>
            <p>Tell us a little bit about yourself</p>
            o<a href="https://github.com/matmss">Acessar Perfil no GitHub</a>
          </li>
          <li class="dev-item">
            <header>
              <img src="https://avatars1.githubusercontent.com/u/26112787?s=460&v=4" alt="Matheus Santos"/>
              <div className="user-info">
                <strong>Matheus Santos</strong>
                <span>ReactJS, React Native, NodeJS</span>
              </div>
            </header>
            <p>Tell us a little bit about yourself</p>
            o<a href="https://github.com/matmss">Acessar Perfil no GitHub</a>
          </li>
          <li class="dev-item">
            <header>
              <img src="https://avatars1.githubusercontent.com/u/26112787?s=460&v=4" alt="Matheus Santos"/>
              <div className="user-info">
                <strong>Matheus Santos</strong>
                <span>ReactJS, React Native, NodeJS</span>
              </div>
            </header>
            <p>Tell us a little bit about yourself</p>
            o<a href="https://github.com/matmss">Acessar Perfil no GitHub</a>
          </li>
        </ul>
      </main>
    </div>
  );
}

export default App;
