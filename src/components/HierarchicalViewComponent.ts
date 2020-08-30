import {Component, OnInit} from "@angular/core";
import {HttpClient, HttpClientModule} from '@angular/common/http';

@Component({template: require("./templates/hierarchical-view-component.html")})
export class HierarchicalViewComponent implements OnInit {
    public artists: any;

    public constructor() {}
    
    public ngOnInit(): void {}   
}
