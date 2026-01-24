import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { routes } from './app.routes'

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' }),BrowserModule],
  declarations: [],
  bootstrap: []
})
export class AppModule { }