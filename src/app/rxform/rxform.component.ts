import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, FormArray, Validators} from '@angular/forms';
import { Observable } from 'rxjs';

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
export class RxformComponent implements OnInit {

  orgList : FormGroup;
  addItemsButton : FormControl;
  offset : number = 0;
  items : Simple[] = [];
  itemsFav : Simple[] = [];
  favs : number[] = [];
  private pagesize : number = 10;
  private lastId : number = 0;

  constructor(private http: HttpClient) { 
    
  }

  ngOnInit() {
    if(sessionStorage.getItem('favs')) this.favs = (sessionStorage.getItem('favs').split(',')).map(parseFloat);

    this.getItems().subscribe( t  => {this.addItems(t);});
    this.orgList = new FormGroup({});
  }

  private getItems(): Observable<string[]> {
    return this.http.get<string[]>('https://cors-anywhere.herokuapp.com/https://demo.ckan.org/api/3/action/organization_list?limit=' + this.pagesize + '&offset='+ this.offset+'&sort=name');
  }

  addNewItems(){
    this.offset+=this.pagesize;
    this.getItems().subscribe( t  => {this.addItems(t); console.log(this.items)});
  }

  private addItems(newItems){
    for( let i = 0; i<this.pagesize; i++ ){
      if( newItems.result[i] ) {
        let item = new Simple;
        item.id = this.lastId++;
        item.name = newItems.result[i];
        this.favs.find(u => u == item.id) ? item.is_star = true :  item.is_star = false;
        if (item.is_star == true) this.itemsFav.push( item );
        this.items.push( item ); 
      }
    }
  }

  toStar(num: number){
    let temp = this.itemsFav;
    this.itemsFav = [];
    this.items[num].is_star = !this.items[num].is_star;
    if (this.items[num].is_star) {
      this.favs.push(num);
      temp.push(this.items[num]);
    } else {
      const index = this.favs.indexOf(num);
      if (index !== -1) this.favs.splice(index, 1);
      const indexX = temp.indexOf(this.items[num]);
      if (indexX !== -1) temp.splice(indexX, 1);
    }
    this.itemsFav = temp;
    sessionStorage.setItem('favs', this.favs.join(','));
  }

}
