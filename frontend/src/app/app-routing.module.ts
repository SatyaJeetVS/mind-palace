import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TopicComponent } from './pages/topic/topic.component';
import { SubtopicComponent } from './pages/subtopic/subtopic.component';

const routes: Routes = [
  { path: 'topics', children: [
    { path: ':topicSlug', component: TopicComponent },
    { path: ':topicSlug/:subtopicSlug', component: SubtopicComponent }
  ]},
  { path: '', redirectTo: '/topics', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
