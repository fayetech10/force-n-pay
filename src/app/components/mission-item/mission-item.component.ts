import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Mission } from '../../interfaces/Mission';

@Component({
  selector: 'app-mission-item',
  imports: [],
  templateUrl: './mission-item.component.html',
  styleUrl: './mission-item.component.scss'
})
export class MissionItemComponent {
  @Input() mission: Mission | undefined;
  @Output() addReport = new EventEmitter();
  @Output() viewDetails = new EventEmitter();
  expanded = false;

}
