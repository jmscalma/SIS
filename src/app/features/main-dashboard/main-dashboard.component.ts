import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router} from '@angular/router';
import { AppService } from '../../app.service';

@Component({
  selector: 'app-main-dashboard',
  templateUrl: './main-dashboard.component.html',
  styleUrl: './main-dashboard.component.css'
})
export class MainDashboardComponent implements OnInit {

  pageNo: number = 1;
  pageSize: number = 5;
  total: number = 0;
  dataFiles: any;
  keyword: string = '';
  dataSource: any[] = [];

  constructor( private service: AppService,
               private router: Router){
             }

  ngOnInit() {
    this.getAllStudents(this.pageNo, this.pageSize, this.keyword);
    }

    getAllStudents(pageNo: number, pageSize: number, keyword: string) {
      this.service.getAllStudent(pageNo, pageSize, keyword)
        .subscribe((data: any) => {
          this.dataFiles = data.data;
          this.total = data.total;
          this.dataSource = data.data;
          this.service.search = data.result;
          console.log('keyword', keyword)
        });
    }

}
