// import { bootstrapApplication } from '@angular/platform-browser';
// import { provideHttpClient } from '@angular/common/http';
// import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';
// import { routes } from './app/app-routing-module';
// import { App } from './app/app';

// bootstrapApplication(App, {
//   providers: [
//     provideRouter(routes, withEnabledBlockingInitialNavigation()),
//     provideHttpClient()
//   ]
// }).catch(err => console.error(err));


import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';
import { routes } from './app/app-routing-module'; // now this works
import { App } from './app/app';

bootstrapApplication(App, {
  providers: [
    provideRouter(routes, withEnabledBlockingInitialNavigation()),
    provideHttpClient()
  ]
}).catch(err => console.error(err));