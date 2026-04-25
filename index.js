import { fetchJSON, renderProjects, fetchGitHubData } from './global.js';

const projects = await fetchJSON('./lib/projects.json');

const latestProjects = projects.slice(0, 3);

const projectsContainer = document.querySelector('.projects');

renderProjects(latestProjects, projectsContainer, 'h2');

const githubData = await fetchGitHubData('ChengszuPeng');
console.log(githubData);

const profileStats = document.querySelector('#profile-stats');

if (profileStats) {
 profileStats.innerHTML = `
  <h2>My GitHub Stats</h2>
  <div class="stats-grid">
    <div class="stat">
      <p>FOLLOWERS</p>
      <h3>${githubData.followers}</h3>
    </div>
    <div class="stat">
      <p>FOLLOWING</p>
      <h3>${githubData.following}</h3>
    </div>
    <div class="stat">
      <p>PUBLIC REPOS</p>
      <h3>${githubData.public_repos}</h3>
    </div>
    <div class="stat">
      <p>PUBLIC GISTS</p>
      <h3>${githubData.public_gists}</h3>
    </div>
  </div>
`;
}
