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

  // håll koll på aktiv kolumn
  sortKey = signal<keyof Course | ''>('');
  // stigande (true), fallande (false)
  sortAscending = signal<boolean>(true);


  filteredCourses = computed(() => {
    const search = this.searchTerm().toLowerCase().trim();
    let courses = [...this.allCourses()];

    if (search) {
      courses = courses.filter(course => 
      course.code.toLowerCase().includes(search) ||
      course.coursename.toLowerCase().includes(search)
    );
  }

  // sortera om sortKey har valts
  const key = this.sortKey();
  if(key) {
    const ascending = this.sortAscending();

    courses.sort((a, b) => {
      const valA = String(a[key] as keyof Course).toLowerCase();
      const valB = String(b[key] as keyof Course).toLowerCase();

      if (valA < valB) return ascending ? -1 : 1;
      if (valA > valB) return ascending ? 1 : -1;
      return 0;
    })
  }
  
  return courses;
  });

// klick på tabellrubrik
changeSort(key: keyof Course): void {
  if (this.sortKey() === key) {
    this.sortAscending.set(!this.sortAscending());
  } else {
    this.sortKey.set(key);
    this.sortAscending.set(true);
  }
}

 ngOnInit(): void {
  this.courseService.getCourses().subscribe({
    next: (data) => this.allCourses.set(data),
    error: (err) => console.error('Kunde inte hämta kurser:', err)
  });
 } 
}
