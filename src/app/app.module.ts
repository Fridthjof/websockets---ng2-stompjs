import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {StompConfig, StompService} from '@stomp/ng2-stompjs';
import {AppComponent} from './app.component';
// import {Ng2StompComponent} from './ng2-stomp/ng2-stomp.component'
import {ChartsModule} from 'ng2-charts';
import * as SockJS from 'sockjs-client';

export function receiverProvider() {
    return new SockJS('http://192.168.3.129:8080/socket');
}

const stompConfig: StompConfig = {
    // Which server?
    url: receiverProvider,

    // Headers
    // Typical keys: login, passcode, host
    headers: {
    //     login: 'guest',
    //     passcode: 'guest'
    },

    // How often to heartbeat?
    // Interval in milliseconds, set to 0 to disable
    heartbeat_in: 0, // Typical value 0 - disabled
    heartbeat_out: 20000, // Typical value 20000 - every 20 seconds
    // Wait in milliseconds before attempting auto reconnect
    // Set to 0 to disable
    // Typical value 5000 (5 seconds)
    reconnect_delay: 10000,

    // Will log diagnostics on console
    debug: true
};


@NgModule({
    declarations: [
        AppComponent,
        // Ng2StompComponent
    ],
    imports: [
        BrowserModule,
        ChartsModule
    ],
    providers: [
        StompService,
        {
            provide: StompConfig,
            useValue: stompConfig
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
