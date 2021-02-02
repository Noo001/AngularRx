import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, FormArray, Validators} from '@angular/forms';
import { Observable, Subscription } from 'rxjs';

export class Simple {
  id: number;
  name: string;
  is_star: boolean;
}

@Component({
  selector: 'app-rxform',
  templateUrl: './rxform.component.html',
  styleUrls: ['./rxform.component.scss']
})
export class RxformComponent implements OnInit, OnDestroy {

  orgList: FormGroup;
  addItemsButton: FormControl;
  offset: number = 0;
  items: Simple[] = [];
  favs: number[] = [];
  favsList: string[] = []; 
  showList: boolean = false;
  showFavorites: boolean = false;
  private pagesize : number = 10;
  private lastId : number = 0;
  private subscriptions: Subscription[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    if(localStorage.getItem('favs')) this.favs = (localStorage.getItem('favs').split(',')).map(parseFloat);
    if(localStorage.getItem('favsList')) this.favsList = (localStorage.getItem('favsList').split(','));

    this.subscriptions.push(this.getItems().subscribe( t  => {this.addItems(t);}));
    this.orgList = new FormGroup({});
  }

  private getItems(): Observable<string[]> {
    return this.http.get<string[]>('https://cors-anywhere.herokuapp.com/https://demo.ckan.org/api/3/action/organization_list?limit=' + this.pagesize + '&offset='+ this.offset+'&sort=name');
  }

  addNewItems(){
    this.offset+=this.pagesize;
    this.subscriptions.push(this.getItems().subscribe( t  => {this.addItems(t);}));
  }

  private addItems(newItems){
    for( let i = 0; i<this.pagesize; i++ ){
      if( newItems.result[i] ) {
        let item = new Simple;
        item.id = this.lastId++;
        item.name = newItems.result[i];
        this.favs.find(u => u == item.id) ? item.is_star = true :  item.is_star = false;
        this.items.push( item ); 
      }
    }
  }

  toStar(num: number){
    this.items[num].is_star = !this.items[num].is_star;
    if (this.items[num].is_star) {
      this.favs.push(this.items[num].id);
      this.favs.sort();
      this.favsList.push(this.items[num].name);
      this.favsList.sort();
    } else {
      const index = this.favs.indexOf(num);
      if (index !== -1) {
        this.favs.splice(index, 1);
        this.favsList.splice(index, 1);
      }
    }
    localStorage.setItem('favs', this.favs.join(','));
    localStorage.setItem('favsList', this.favsList.join(','));
  }

  ngOnDestroy(){
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
