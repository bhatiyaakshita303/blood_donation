import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';

// import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Login } from './components/auth/login/login';
import { Register } from './components/auth/register/register';

@NgModule({
  declarations: [
    // App is now standalone
  ],
  imports: [
    BrowserModule,
    // AppRoutingModule,
    Login,
    Register,
    ReactiveFormsModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient()
  ],
  bootstrap: [App] // This won't work since App is standalone
})
export class AppModule { }
