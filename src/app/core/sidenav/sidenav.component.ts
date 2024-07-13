import { Component, Input, Output, EventEmitter, HostListener, OnInit } from '@angular/core';
import { Sidebar } from 'primeng/sidebar';
import { navbar } from './nav-data';
import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AppService } from '../../app.service';
import { ConfirmDialogueComponent } from '../../features/confirmation-dialogue/confirm-dialogue/confirm-dialogue.component';

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

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 768) {
      this.collapsed = false;
      this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
    }
  }

  constructor(private router: Router, private service: AppService, private dialog: MatDialog, private confirmationService: ConfirmationService, private message: MessageService) { }

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;
  }

  logouts() {
    this.service.handleSignOut().then (() =>{
      this.router.navigate(['/login']);
    }).catch((error)=>{
      console.log ("something went wrong")
    });
  }

  // logout() {
  //   this.confirmationService.confirm({
  //     message: 'Are you sure that you want to logout?',
  //     header: 'Confirmation',
  //     icon: 'pi pi-exclamation-triangle',
  //     acceptIcon: 'pi pi-check',
  //     rejectIcon: 'pi pi-times',
  //     acceptButtonStyleClass: 'p-button-success',
  //     rejectButtonStyleClass: 'p-button-text',
  //     accept: () => {
  //       this.service.handleSignOut().then(() => {
  //         this.router.navigate(['/login']);
  //       }).catch((error) => {
  //         console.error('Error during logout:', error);
  //         this.message.add({ severity: 'error', summary: 'Error', detail: 'Failed to logout', life: 3000 });
  //       });
  //     },
  //     reject: () => {
  //       this.message.add({ severity: 'info', summary: 'Rejected', detail: 'Logout canceled', life: 3000 });
  //     }
  //   });
  // }

  openConfirmDialog(reverseButtons: boolean) {
    const dialogRef = this.dialog.open(ConfirmDialogueComponent, {
      width: '300px',
      position: {top: '18%', left: '45%'},
      data: { title: 'Logout Confirmation', message: 'Are you sure you want to logout?', reverseButtons: reverseButtons }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        sessionStorage.clear();
        this.logouts(); // Call logouts method
      }
    });
  }

  toggleChildrenVisibility(parentOption: any) {
    parentOption.childrenVisible = !parentOption.childrenVisible;
  }

}
