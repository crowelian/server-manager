import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BehaviorSubject, catchError, map, Observable, of, startWith, throwError } from 'rxjs';
import { DataState } from './enum/data.state.enum';
import { Status } from './enum/status.enum';
import { AppState } from './interface/app-state';
import { CustomResponse } from './interface/custom-response';
import { Server } from './interface/server';
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
  private isLoading: BehaviorSubject<Boolean> = new BehaviorSubject<Boolean>(false);
  isLoading$: Observable<Boolean> = this.isLoading.asObservable();

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

  saveServer(serverForm: NgForm): void {
    this.isLoading.next(true);
    this.appState$ = this.serverService.save$(serverForm.value as Server)
      .pipe(
        map(response => {
          this.dataSubject.next(
            {...response, data: { servers: [response.data.server!, ...this.dataSubject.value.data.servers!] } }
          ); // push the server from the response put it on index 0
          if (document.getElementById('closeModal') !== null) {
            document.getElementById('closeModal')!.click();
          }
          
          this.isLoading.next(false);
          serverForm.resetForm({ status: this.Status.SERVER_DOWN });
          return { dataState: DataState.LOADED_STATE, appData: this.dataSubject.value }
        }),
        startWith({ dataState: DataState.LOADED_STATE, appData: this.dataSubject.value }),
        catchError((error: string) => {
          this.isLoading.next(false);
          return of({ dataState: DataState.ERROR_STATE, error });
        })
      );
}

deleteServer(server: Server): void {
  this.appState$ = this.serverService.delete$(server.id)
    .pipe(
      map(response => {
        this.dataSubject.next(
          { ...response, data: 
            { servers: this.dataSubject.value.data.servers!.filter(serverToKeep => serverToKeep.id !== server.id)} }
        );
        
        return { dataState: DataState.LOADED_STATE, appData: this.dataSubject.value }
      }),
      startWith({ dataState: DataState.LOADED_STATE, appData: this.dataSubject.value }),
      catchError((error: string) => {
        
        return of({ dataState: DataState.ERROR_STATE, error });
      })
    );
}

}
