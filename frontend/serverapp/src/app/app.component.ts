import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, startWith } from 'rxjs';
import { DataState } from './enum/data.state.enum';
import { Status } from './enum/status.enum';
import { AppState } from './interface/app-state';
import { CustomResponse } from './interface/custom-response';
import { ServerService } from './service/server.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  appState$!: Observable<AppState<CustomResponse>>;
  readonly DataState = DataState;
  readonly Status = Status;
  private filterSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  filterStatus$: Observable<string> = this.filterSubject.asObservable();

  title = 'Server Manager';
  subTitle = '- remember your server -';

  constructor(private serverService: ServerService) {}
  ngOnInit(): void {
    this.appState$ = this.serverService.servers$
    .pipe(
      map((response) => {
        console.log("RESPONSE");
      
        return { dataState: DataState.LOADED_STATE, appData: response };
      }),
      startWith({
        dataState: DataState.LOADING_STATE, // use this while waiting for the server to respond
      }),
      catchError((error: string) => {
        return of({
          dataState: DataState.ERROR_STATE,
          error: error,
        });
      })
    );
  }

  

}
