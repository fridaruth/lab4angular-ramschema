import { Routes } from '@angular/router';
import { CourseList } from './components/course-list/course-list';

export const routes: Routes = [
    { path: "home", component: CourseList },
    { path: "", redirectTo: "/home", pathMatch: "full" }
];
