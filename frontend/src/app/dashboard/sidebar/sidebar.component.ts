import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../authentication/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  imports: [MatSidenavModule, MatListModule, MatIconModule,RouterModule,CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  sessionId:number=0;
  designationId:number=0;

  constructor(private authService : AuthService){
    this.sessionId=Number(this.authService.getSessionId())
    this.designationId=Number(this.authService.getDesignationId())
  }

  isMorning(): boolean {
    return this.sessionId === 1; 
  }

  isAfernoon(): boolean {
    return this.sessionId === 2; 
  }

  isTeacher(): boolean {
    return this.designationId === 1 || this.designationId===4; 
  }

}
