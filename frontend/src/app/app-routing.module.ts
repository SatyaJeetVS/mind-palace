import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PythonBasicsComponent } from './pages/subtopics/python-basics/python-basics.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'topics', component: DashboardComponent },
  { path: 'topics/:id', component: DashboardComponent },
  { path: 'subtopic/variables-data-types', component: PythonBasicsComponent },
  { path: 'subtopic/control-flow', component: PythonBasicsComponent },
  { path: 'subtopic/functions', component: PythonBasicsComponent },
  { path: 'subtopic/data-structures', component: PythonBasicsComponent },
  { path: 'subtopic/file-handling', component: PythonBasicsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
