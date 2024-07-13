import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main/main.component';
import { HeaderComponent } from './header/header.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './footer/footer.component';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { StyleClassModule } from 'primeng/styleclass';
import { RippleModule } from 'primeng/ripple';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { SplitButtonModule } from 'primeng/splitbutton';
import { MenuModule } from 'primeng/menu';

@NgModule({
  declarations: [
    SidenavComponent,
    HeaderComponent,
    FooterComponent,
    MainComponent
  ],
  imports: [
    RouterModule,
    CommonModule,
    SidebarModule,
    ButtonModule,
    AvatarModule,
    AvatarGroupModule,
    StyleClassModule,
    RippleModule,
    MatDialogModule,
    MatIconModule,
    SplitButtonModule,
    MenuModule
  ]
})
export class CoreModule { }
