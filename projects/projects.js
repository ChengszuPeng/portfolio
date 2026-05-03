import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';
import { fetchJSON, renderProjects } from '../global.js';

let query = '';
let selectedIndex = -1;

const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');
const titleElement = document.querySelector('.projects-title');
const searchInput = document.querySelector('.searchBar');

function getFilteredProjects() {
  return projects.filter((project) => {
    let values = Object.values(project).join('\n').toLowerCase();
    return values.includes(query.toLowerCase());
  });
}

function renderPieChart(projectsGiven) {
  const svg = d3.select('#projects-pie-plot');
  const legend = d3.select('.legend');

  svg.selectAll('path').remove();
  legend.selectAll('li').remove();

  const rolledData = d3.rollups(
    projectsGiven,
    v => v.length,
    d => d.year
  );

  const data = rolledData.map(([year, count]) => {
    return { value: count, label: year };
  });

  const arcGenerator = d3.arc()
    .innerRadius(0)
    .outerRadius(50);

  const colors = d3.scaleOrdinal(d3.schemeTableau10);
  const pie = d3.pie().value(d => d.value);
  const arcData = pie(data);

  arcData.forEach((d, i) => {
    svg.append('path')
      .attr('d', arcGenerator(d))
      .attr('fill', colors(i))
      .attr('class', i === selectedIndex ? 'selected' : '')
      .on('click', () => {
        selectedIndex = selectedIndex === i ? -1 : i;
        updatePage();
      });
  });

  data.forEach((d, i) => {
    legend.append('li')
      .attr('style', `--color:${colors(i)}`)
      .attr('class', i === selectedIndex ? 'selected' : '')
      .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
  });

  return data;
}

function updatePage() {
  let filteredProjects = getFilteredProjects();

  const rolledData = d3.rollups(
    filteredProjects,
    v => v.length,
    d => d.year
  );

  const data = rolledData.map(([year, count]) => {
    return { value: count, label: year };
  });

  if (selectedIndex !== -1) {
    const selectedYear = data[selectedIndex].label;
    filteredProjects = filteredProjects.filter((project) => project.year === selectedYear);
  }

  titleElement.textContent = `${filteredProjects.length} Projects`;
  projectsContainer.innerHTML = '';
  renderProjects(filteredProjects, projectsContainer, 'h2');
  renderPieChart(getFilteredProjects());
}

updatePage();

searchInput.addEventListener('input', (event) => {
  query = event.target.value;
  selectedIndex = -1;
  updatePage();
});