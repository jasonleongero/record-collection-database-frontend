import {Component, OnInit} from "@angular/core";
import {HttpClient, HttpClientModule} from '@angular/common/http';

@Component({template: require("./templates/flat-view-component.html")})
export class FlatViewComponent implements OnInit {
    public artists: any;

    public constructor() {}
    
    public ngOnInit(): void {}   
}
