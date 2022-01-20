import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { SquareComponent } from "./square/square.component";
import { BoardComponent } from "./board/board.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ScoresheetComponent } from './scoresheet/scoresheet.component';
import { SquareState } from './store/states/square.state';

import { MatButtonModule } from "@angular/material/button";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatTableModule } from "@angular/material/table";
import { NgxsModule } from '@ngxs/store';
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    ScoresheetComponent,
    SquareComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    MatButtonModule,
    MatTableModule,
    NgxsModule.forRoot([SquareState], {
      developmentMode: !environment.production
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
