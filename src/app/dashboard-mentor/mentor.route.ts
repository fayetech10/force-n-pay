import {Routes} from '@angular/router';
import {MentorComponent} from '../user-management/mentor/mentor.component';
import {SeanceListComponentComponent} from './seance-list-component/seance-list-component.component';
import {DashboardMentorComponent} from './components/dashboard-mentor.component';
import {PaimentMentorComponent} from './components/paiment-mentor/paiment-mentor.component';

export const  MentorRoute: Routes = [

  {
    path: '',
    component: SeanceListComponentComponent
  },
  {
    path: 'payment',
    component: PaimentMentorComponent
  }
]
