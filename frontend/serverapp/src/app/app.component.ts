import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  startWith,
} from 'rxjs';
import { DataState } from './enum/data.state.enum';
import { Status } from './enum/status.enum';
import { AppState } from './interface/app-state';
import { CustomResponse } from './interface/custom-response';
import { Server } from './interface/server';
import { ServerService } from './service/server.service';
import { NotificationService } from './service/notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  appState$!: Observable<AppState<CustomResponse>>;
  readonly DataState = DataState;
  readonly Status = Status;
  private filterSubject: BehaviorSubject<string> = new BehaviorSubject<string>(
    ''
  );
  private dataSubject: BehaviorSubject<CustomResponse> =
    new BehaviorSubject<CustomResponse>(null!);
  filterStatus$: Observable<string> = this.filterSubject.asObservable();
  private isLoading: BehaviorSubject<Boolean> = new BehaviorSubject<Boolean>(
    false
  );
  isLoading$: Observable<Boolean> = this.isLoading.asObservable();

  title = 'Server Manager';
  subTitle = '- remember your server -';

  private notifier: NotificationService;

  constructor(private serverService: ServerService, private _notifier: NotificationService) {
    this.notifier = _notifier;
  }

  ngOnInit(): void {
    this.appState$ = this.serverService.servers$.pipe(
      map((response) => {
        this.notifier.onSuccess(response.message);
        this.dataSubject.next(response); // this copy is needed in pingServer
        return { dataState: DataState.LOADED_STATE, appData: response };
      }),
      startWith({
        dataState: DataState.LOADING_STATE, // use this while waiting for the server to respond
      }),
      catchError((error: string) => {
        this.notifier.onError(error);
        return of({
          dataState: DataState.ERROR_STATE,
          error: error,
        });
      })
    );
  }

  pingServer(ipAddress: string): void {
    this.filterSubject.next(ipAddress); // pass the ipAddress to filterSubject
    this.appState$ = this.serverService.ping$(ipAddress).pipe(
      map((response) => {
        if (response == null) throw new Error('no response');
        if (this.dataSubject?.value?.data?.servers == null)
          throw new Error('no servers');

        const serverIndex = this.dataSubject.value.data.servers.findIndex(
          (server) => server.id === response.data.server?.id
        );
        if (serverIndex < 0) {
          throw new Error('server not found');
        }
        if (response.data.server == null) throw new Error('server not found');

        this.dataSubject.value.data.servers[serverIndex] = response.data.server;

        if (response.message.toString().includes("failed")) {
          this.notifier.onWarning(response.message);
        } else {
          this.notifier.onSuccess(response.message);
        }

        this.filterSubject.next(''); // hides the spinner
        return {
          dataState: DataState.LOADED_STATE,
          appData: this.dataSubject.value,
        };
      }),
      startWith({
        dataState: DataState.LOADED_STATE,
        appData: this.dataSubject.value, // the data is already loaded here, get it by calling value of the BehaviorSubject
      }),
      catchError((error: string) => {
        this.notifier.onError(error);
        this.filterSubject.next(''); // hides the spinner
        return of({
          dataState: DataState.ERROR_STATE,
          error: error,
        });
      })
    );
  }

  filterServers(status: Status): void {
    console.log('FILTER SERVER with', status);
    this.appState$ = this.serverService
      .filter$(status, this.dataSubject.value)
      .pipe(
        map((response) => {

          return { dataState: DataState.LOADED_STATE, appData: response };
        }),
        startWith({
          dataState: DataState.LOADED_STATE,
          appData: this.dataSubject.value,
        }),
        catchError((error: string) => {
          this.notifier.onError(error);
          return of({ dataState: DataState.ERROR_STATE, error });
        })
      );
  }

  saveServer(serverForm: NgForm): void {
    this.isLoading.next(true);
    this.appState$ = this.serverService.save$(serverForm.value as Server).pipe(
      map((response) => {
        this.dataSubject.next({
          ...response,
          data: {
            servers: [
              response.data.server!,
              ...this.dataSubject.value.data.servers!,
            ],
          },
        }); // push the server from the response put it on index 0
        if (document.getElementById('closeModal') !== null) {
          document.getElementById('closeModal')!.click();
        }

        this.isLoading.next(false);
        serverForm.resetForm({ status: this.Status.SERVER_DOWN });
        this.notifier.onSuccess(response.message);
        return {
          dataState: DataState.LOADED_STATE,
          appData: this.dataSubject.value,
        };
      }),
      startWith({
        dataState: DataState.LOADED_STATE,
        appData: this.dataSubject.value,
      }),
      catchError((error: string) => {
        this.notifier.onError(error);
        this.isLoading.next(false);
        return of({ dataState: DataState.ERROR_STATE, error });
      })
    );
  }

  deleteServer(server: Server): void {
    this.appState$ = this.serverService.delete$(server.id).pipe(
      map((response) => {
        this.dataSubject.next({
          ...response,
          data: {
            servers: this.dataSubject.value.data.servers!.filter(
              (serverToKeep) => serverToKeep.id !== server.id
            ),
          },
        });

        this.notifier.onSuccess(response.message);

        return {
          dataState: DataState.LOADED_STATE,
          appData: this.dataSubject.value,
        };
      }),
      startWith({
        dataState: DataState.LOADED_STATE,
        appData: this.dataSubject.value,
      }),
      catchError((error: string) => {
        this.notifier.onError(error);
        return of({ dataState: DataState.ERROR_STATE, error });
      })
    );
  }

  printReport(): void {
    // Print as PDF
    //window.print();
    //this.notifier.onSuccess("print PDF");

    // Print as Excel
    let dataType = 'application/vnd.ms-excel.sheet.macroEnabled.12';
    let tableSelect = document.getElementById('servers');
    if (tableSelect === undefined) return;
    const icons = tableSelect?.querySelector('tbody tr td a i');

    this.removeItalicElements(tableSelect!); // better way would be to remove the cells maybe, or tag the cells that you want to print.

    let tableHtml = tableSelect!.outerHTML.replace(/ /g, '%20');
    tableHtml.replace('&#xE328;', '---');

    let downloadLink = document.createElement('a');
    document.body.appendChild(downloadLink);
    downloadLink.href = 'data:' + dataType + ', ' + tableHtml;
    downloadLink.download = 'server-report.xls';
    downloadLink.click();
    document.body.removeChild(downloadLink);

    this.notifier.onSuccess("print xls file");
  }

  removeItalicElements(node: Node | HTMLElement): void {
    if (node.nodeType === Node.TEXT_NODE) {
      // If it's a text node, do nothing
      return;
    }

    if ((node as Element).tagName === 'I') {
      // If it's an i element, remove it
      node.parentNode!.removeChild(node);
    } else {
      // If it's not an i element, check its child nodes
      const childNodes = node.childNodes;
      for (let i = 0; i < childNodes.length; i++) {
        this.removeItalicElements(childNodes[i]);
      }
    }
  }
}
