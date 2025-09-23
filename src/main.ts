import { bootstrapApplication } from '@angular/platform-browser';
import { mergeApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideRouter, withHashLocation } from '@angular/router';
import { routes } from './app/app.routes';

const config = mergeApplicationConfig(appConfig, {
  providers: [provideHttpClient(),
  provideRouter(routes, withHashLocation())
  ]
});

bootstrapApplication(AppComponent, config)
  .catch(err => console.error(err));
