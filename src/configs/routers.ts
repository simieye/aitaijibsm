import INDEX from '../pages/index.jsx';
import SIMULATION from '../pages/simulation.jsx';
import AGENTS from '../pages/agents.jsx';
import REPORTS from '../pages/reports.jsx';
import API from '../pages/api.jsx';
import DASHBOARD from '../pages/dashboard.jsx';
export const routers = [{
  id: "index",
  component: INDEX
}, {
  id: "simulation",
  component: SIMULATION
}, {
  id: "agents",
  component: AGENTS
}, {
  id: "reports",
  component: REPORTS
}, {
  id: "api",
  component: API
}, {
  id: "dashboard",
  component: DASHBOARD
}]