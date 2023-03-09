import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, startWith, throwError } from 'rxjs';
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
  private dataSubject: BehaviorSubject<CustomResponse> = new BehaviorSubject<CustomResponse>(null!);
  filterStatus$: Observable<string> = this.filterSubject.asObservable();

  title = 'Server Manager';
  subTitle = '- remember your server -';


  constructor(private serverService: ServerService) {}


  ngOnInit(): void {
    this.appState$ = this.serverService.servers$
    .pipe(
      map((response) => {
        this.dataSubject.next(response); // this copy is needed in pingServer
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



  pingServer(ipAddress: string): void {
    this.filterSubject.next(ipAddress); // pass the ipAddress to filterSubject
    this.appState$ = this.serverService.ping$(ipAddress)
    .pipe(
      map((response) => {
        if (response == null) throw new Error("no response");
        if (this.dataSubject?.value?.data?.servers == null) throw new Error("no servers");

        const serverIndex = this.dataSubject.value.data.servers.findIndex(server => server.id === response.data.server?.id);
        if (serverIndex < 0) {
          throw new Error("server not found");
        }
        if (response.data.server == null) throw new Error("server not found");

        this.dataSubject.value.data.servers[serverIndex] = response.data.server;
        this.filterSubject.next(''); // hides the spinner
        return { dataState: DataState.LOADED_STATE, appData: this.dataSubject.value }
      }),
      startWith({
        dataState: DataState.LOADED_STATE, appData: this.dataSubject.value // the data is already loaded here, get it by calling value of the BehaviorSubject
      }),
      catchError((error: string) => {
        this.filterSubject.next(''); // hides the spinner
        return of({
          dataState: DataState.ERROR_STATE,
          error: error,
        });
      })
    );
  }


  filterServers(status: Status): void {
    console.log("FILTER SERVER with", status);
    this.appState$ = this.serverService.filter$(status, this.dataSubject.value)
      .pipe(
        map(response => {
          return { dataState: DataState.LOADED_STATE, appData: response };
        }),
        startWith({ dataState: DataState.LOADED_STATE, appData: this.dataSubject.value }),
        catchError((error: string) => {
          return of({ dataState: DataState.ERROR_STATE, error });
        })
      );
  }



}
