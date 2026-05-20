import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CourseService } from '../../services/course.service';
import { Course } from '../../models/course';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './course-list.html',
  styleUrl: './course-list.scss',
})
export class CourseList implements OnInit {
  private courseService = inject(CourseService);

  allCourses = signal<Course[]>([]);
  searchTerm = signal<string>('');

  filteredCourses = computed(() => {
    const search = this.searchTerm().toLowerCase().trim();
    const courses = this.allCourses();

    if (!search) {
      return courses;
    }

    return courses.filter(course => 
      course.code.toLowerCase().includes(search) ||
      course.coursename.toLowerCase().includes(search)
    );
  });

 ngOnInit(): void {
  this.courseService.getCourses().subscribe({
    next: (data) => this.allCourses.set(data),
    error: (err) => console.error('Kunde inte hämta kurser:', err)
  });
 } 
}
