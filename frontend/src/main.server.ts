import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';

const bootstrap = () => bootstrapApplication(AppComponent, config);
const app = express();

// Import custom server logic
import customServer from '../../backend/src/server.js';

customServer(app);
export default bootstrap;
