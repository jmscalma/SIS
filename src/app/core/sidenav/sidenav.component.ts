import { Component, Input, Output, EventEmitter, HostListener, OnInit } from '@angular/core';
import { Sidebar } from 'primeng/sidebar';
import { navbar } from './nav-data';
import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AppService } from '../../app.service';
import { ConfirmDialogComponent } from '../../shared/dialog/confirm-dialog/confirm-dialog.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AuthService } from '../../features/auth/auth.service';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
  providers: [ConfirmationService],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('300ms', style({ opacity: 0 }))
      ])
    ]),
    trigger('rotate', [
      transition(':enter', [
        animate('1000ms', keyframes([
          style({ transform: 'rotate(0deg)', offset: '0' }),
          style({ transform: 'rotate(2turn)', offset: '1' })
        ]))
      ])
    ])
  ]
})
export class SidenavComponent {


  rightclose: boolean = true;
  leftclose: boolean = false;

  @Input() collapsed = true;
  @Input() screenWidth = 768;

  @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();

  nav = navbar;
  ref: DynamicDialogRef | undefined;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 768) {
      this.collapsed = false;
      this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
    }
  }

  constructor(private authService: AuthService, private dialogService: DialogService, private router: Router, private service: AppService, private confirmationService: ConfirmationService, private message: MessageService) { }

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;
  }

  logouts() {
    this.authService.handleSignOut().then (() =>{
      this.router.navigate(['/login']);
    }).catch((error)=>{
      console.log ("something went wrong")
    });
  }

  show() {
    this.ref = this.dialogService.open(ConfirmDialogComponent, {
      header: 'Logout Confirmation',
      width: '300px',
      contentStyle: { 'max-height': '350px', 'overflow': 'auto' },
      baseZIndex: 10000,
      data: { message: 'Are you sure you want to logout?', dialogRef: this.ref } // Pass the ref if needed by ConfirmDialogueComponent
    });

    this.ref.onClose.subscribe((result: boolean) => {
      if (result) {
        sessionStorage.clear();
        this.logouts();
      }
    });
  }

  toggleChildrenVisibility(parentOption: any) {
    parentOption.childrenVisible = !parentOption.childrenVisible;
  }

}
