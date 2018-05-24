import {Component, OnDestroy, OnInit} from '@angular/core';
import {StompService} from '@stomp/ng2-stompjs';
import {Subscription} from 'rxjs/Subscription';
import {Observable} from 'rxjs/Observable';
import {Message} from '@stomp/stompjs';

import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import * as $ from 'jquery';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
//     private serverUrl = 'http://192.168.3.129:8080/socket';
    public title = 'Websocket Test';
//     private stompClient;
//     private stompClientLiveData;
//
//     constructor() {
//         this.initializeWebSocketConnection();
//     }
//
//     ngOnInit() {
//         this.initializeWebSocketConnection();
//     }
//
//     initializeWebSocketConnection() {
//         const ws = new SockJS(this.serverUrl);
//
//         this.stompClient = Stomp.over(ws);
//         const that = this;
//         this.stompClient.connect({}, function (frame) {
//             that.stompClient.subscribe('/data', (message) => {
//                 if (message.body) {
//                     $('.chat').append('<div class=\'message\'>' + message.body + '</div>');
//                 }
//             });
//         });
//     }
//
//     sendMessage(message) {
//         this.stompClient.send('/batchServer/responseData', {}, message);
//         $('#input').val('');
//     }
// }

    // Stream of messages
    private subscription: Subscription;
    public messages: Observable<Message>;
    public startMsg: Observable<Message>;

    dataIsReady: Boolean = false;


    data3Arr: any = [];
    data2Arr: any = [];
    data5Arr: any = [];
    data1Arr: any = [];
    data4Arr: any = [];
    chartData: any = [];
    xAxisData: any = [];


    public subscribed: boolean;

    public history: Array<any> = [];


    public lineChartOptions: any = {
        responsive: true,
        scales: {
            xAxes: [{
                type: 'time',
                time: {
                    displayFormats: {
                        second: 'HH:mm:ss',
                        minute: 'HH:mm',
                        hour: 'MMM D, H[h]'
                    }
                },
                scaleLabel: {
                    display: true,
                    labelString: 'Time'
                },
            }],
            yAxes: [{
                id: 'y-axis-temp',
                type: 'linear',
                display: true,
                position: 'left',
                scaleLabel: {
                    display: true,
                    labelString: 'Temperature'
                },
                ticks: {min: 25, max: 90}
            }, {
                id: 'y-axis-1',
                type: 'linear',
                display: true,
                position: 'right',
                scaleLabel: {
                    display: true,
                    labelString: 'W/W %'
                },
                ticks: {min: 0, max: 25}
            }, {
                id: 'y-axis-2',
                type: 'linear',
                display: true,
                position: 'right',
                scaleLabel: {
                    display: true,
                    labelString: 'Carbohydrate Polymerization'
                },
                ticks: {min: 0, max: 5}
            }]
        }
    };
    public lineChartLegend: Boolean = true;
    public lineChartType: String = 'line';

    constructor(private _stompService: StompService) {

    }

    ngOnInit() {
        this.subscribed = false;

        this.subscribe();
    }

    public subscribe() {
        if (this.subscribed) {
            return;
        }
        // this._stompService.subscribe('/batchServer/data');
        // Stream of messages
        this.messages = this._stompService.subscribe('/data');
        this.startMsg = this._stompService.subscribe('/batchServer/data');
        // Subscribe a function to be run on_next messages
        this.subscription = this.messages.subscribe(this.onNext, error2 => console.log(error2));
        this.subscription = this.startMsg.subscribe(this.onNext, error2 => console.log(error2));

        this.subscribed = true;

    }

    public unsubscribe() {
        if (!this.subscribed) {
            return;
        }

        // This will internally unsubsribe from Stomp Broker
        this.subscription.unsubscribe();
        this.subscription = null;
        this.messages = null;
        this.startMsg = null;

        this.subscribed = false;
    }

    ngOnDestroy() {
        this.unsubscribe();
    }

    public onNext = (message: Message) => {
        // console.log(message);
        // Store message in a history Array
        this.history.push(message.body);
        // if(message.body == Array)i

        if (Array.isArray(JSON.parse(message.body))) {
            this.loopData(JSON.parse(message.body));
        } else {
            this.setData(JSON.parse(message.body));
        }
        console.log(JSON.parse(message.body));
        // this.lineChartData = ;
    };

    // events
    public chartClicked(e: any): void {
        console.log(e);
    }

    public chartHovered(e: any): void {
        console.log(e);
    }

    public makeData() {
        this._stompService.publish('/batchServer/responseData', 'hello');
    }

    private loopData(loopThis) {
        this.dataIsReady = false;
        for (const data of loopThis) {
            this.setData(data);
        }
        this.dataIsReady = true;
    }

    public testBtn() {
        console.log(this.chartData);
        console.log(this.xAxisData);
    }

    private setData(obj) {
        this.xAxisData.push(obj.timestamp);
        this.data3Arr.push(obj.data3);
        this.data2Arr.push(obj.data2 * obj.data1);
        this.data5Arr.push(obj.data5 * obj.data1);
        this.data1Arr.push(obj.data1);
        this.data4Arr.push(obj.data4);
        this.chartData = [
            {
                data: this.data1Arr,
                label: 'Data 1',
                yAxisID: 'y-axis-1'
            },
            {
                data: this.data2Arr,
                label: 'Data 2',
                yAxisID: 'y-axis-1'
            },
            {
                data: this.data3Arr,
                label: 'Data 3',
                yAxisID: 'y-axis-2'
            },
            {
                data: this.data4Arr,
                label: 'Data 4',
                yAxisID: 'y-axis-temp'
            },
            {
                data: this.data5Arr,
                label: 'Data 5',
                yAxisID: 'y-axis-1'
            }
        ];
    }
}
