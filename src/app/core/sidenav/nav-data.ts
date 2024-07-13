import { RouterLink } from "@angular/router";

export const navbar = [

  {
    routeLink: 'add-student',
    icon: 'fa-solid fa-users',
    label: 'Students'
  },
  {
    routeLink: '/login',
    icon: 'fa-solid fa-arrow-right-from-bracket',
    label: 'Logout',
    class: 'Logout-bottom'
  }
];
