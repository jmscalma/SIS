import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router} from '@angular/router';
import { AppService } from '../../app.service';
import moment from 'moment';

@Component({
  selector: 'app-main-dashboard',
  templateUrl: './main-dashboard.component.html',
  styleUrl: './main-dashboard.component.css'
})
export class MainDashboardComponent implements OnInit {

  pageNo: number = 1;
  pageSize: number = 1000;
  total: number = 0;
  dataFiles: any;
  keyword: string = '';
  dataSource: any[] = [];
  chartData: any;
  civilStatusData: any;
  addressData: any;
  registrationChartData: any;
  chartOptions: any;
  lineChartOptions: any;

  //states for loading
  isLoadingTotal: boolean = false;
  isLoadingLastSchool: boolean = false;
  isLoadingCivilStatus: boolean = false;
  isLoadingAddress: boolean = false;
  isLoadingRegistration: boolean = false;

  constructor( private service: AppService,
               private router: Router){
             }

  ngOnInit() {
    this.getAllStudents(this.pageNo, this.pageSize, this.keyword);
    this.getLastSchoolAttended(this.pageNo, this.pageSize, this.keyword);
    this.getCivilStatus(this.pageNo, this.pageSize, this.keyword);
    this.getAddress(this.pageNo, this.pageSize, this.keyword);
    this.getRegistrationDates(this.pageNo, this.pageSize, this.keyword);
    }

    getAllStudents(pageNo: number, pageSize: number, keyword: string) {
      this.isLoadingTotal = true;
      this.service.jwttoken = String(sessionStorage.getItem('IdToken'));
      this.service.getAllStudent(pageNo, pageSize, keyword).subscribe(
        (response: any) => {
          this.isLoadingTotal = false;
          if (response && response.data && response.data.length > 0) {
            const totalData = response.data[1];
            if (totalData && totalData.length > 0 && totalData[0].total) {
              this.total = totalData[0].total;
              // console.log('Total', this.total);
            } else {
              this.total = 0;
              console.error('Total count not found in the response.');
            }
          } else {
            this.total = 0;
            console.error('No data found in the response.');
          }
        },
        (error) => {
          this.isLoadingTotal = false;
          console.error('Error fetching students:', error);
          if (error.status === 401) {
            // Handle unauthorized error (e.g., redirect to login)
          }
        }
      );
    }

    getLastSchoolAttended(pageNo: number, pageSize: number, keyword: string) {
      this.isLoadingLastSchool = true;
      this.service.jwttoken = String(sessionStorage.getItem('IdToken'));
      this.service.getAllStudent(pageNo, pageSize, keyword).subscribe(
        (response: any) => {
          this.isLoadingLastSchool = false;
          if (response && response.data && response.data.length > 0) {
            const studentData = response.data[0];
            if (studentData && studentData.length > 0) {
              const lastSchoolAttended = studentData.map((student: any) => student.last_school_attended);
              // console.log('Last School Attended:', lastSchoolAttended);
              this.prepareChartData(studentData);
            } else {
              console.error('No student data found in the response.');
            }
          } else {
            console.error('No data found in the response.');
          }
        },
        (error) => {
          this.isLoadingLastSchool = false;
          console.error('Error fetching students:', error);
          if (error.status === 401) {
            // Handle unauthorized error (e.g., redirect to login)
          }
        }
      );
    }

    getCivilStatus(pageNo: number, pageSize: number, keyword: string) {
      this.isLoadingCivilStatus = true;
      this.service.jwttoken = String(sessionStorage.getItem('IdToken'));
      this.service.getAllStudent(pageNo, pageSize, keyword).subscribe(
        (response: any) => {
          this.isLoadingCivilStatus = false;
          if (response && response.data && response.data.length > 0) {
            const studentData = response.data[0];
            if (studentData && studentData.length > 0) {
              const civilStatus = studentData.map((student: any) => student.civil_status);
              // console.log('Civil Status:', civilStatus);
              this.civitStatusChartData(studentData);
            } else {
              console.error('No student data found in the response.');
            }
          } else {
            console.error('No data found in the response.');
          }
        },
        (error) => {
          this.isLoadingCivilStatus = false;
          console.error('Error fetching students:', error);
          if (error.status === 401) {
            // Handle unauthorized error (e.g., redirect to login)
          }
        }
      );
    }

    getAddress(pageNo: number, pageSize: number, keyword: string) {
      this.isLoadingAddress = true;
      this.service.jwttoken = String(sessionStorage.getItem('IdToken'));
      this.service.getAllStudent(pageNo, pageSize, keyword).subscribe(
        (response: any) => {
          this.isLoadingAddress = false;
          if (response && response.data && response.data.length > 0) {
            const studentData = response.data[0];
            if (studentData && studentData.length > 0) {
              const Address = studentData.map((student: any) => student.address);
              // console.log('Address:', Address);
              this.AddressChartData(studentData);
            } else {
              console.error('No student data found in the response.');
            }
          } else {
            console.error('No data found in the response.');
          }
        },
        (error) => {
          this.isLoadingAddress = false;
          console.error('Error fetching students:', error);
          if (error.status === 401) {
            // Handle unauthorized error (e.g., redirect to login)
          }
        }
      );
    }

    getRegistrationDates(pageNo: number, pageSize: number, keyword: string) {
      this.isLoadingRegistration = true;
      this.service.jwttoken = String(sessionStorage.getItem('IdToken'));
      this.service.getAllStudent(pageNo, pageSize, keyword).subscribe(
        (response: any) => {
          if (response && response.data && response.data.length > 0) {
            const studentData = response.data[0];
            if (studentData && studentData.length > 0) {
              this.prepareRegistrationChartData(studentData);
            } else {
              console.error('No student data found in the response.');
            }
          } else {
            console.error('No data found in the response.');
          }
        },
        (error) => {
          console.error('Error fetching students:', error);
          if (error.status === 401) {
            // Handle unauthorized error (e.g., redirect to login)
          }
        }
      );
    }


    // getRegistrationDates(pageNo: number, pageSize: number, keyword: string) {
    //   this.isLoadingRegistration = true;
    //   this.service.jwttoken = String(sessionStorage.getItem('IdToken'));
    //   this.service.getAllStudent(pageNo, pageSize, keyword).subscribe(
    //     (response: any) => {
    //       this.isLoadingRegistration = false;
    //       if (response && response.data && response.data.length > 0) {
    //         const studentData = response.data[0];
    //         if (studentData && studentData.length > 0) {
    //           this.prepareRegistrationChartData(studentData);
    //         } else {
    //           console.error('No student data found in the response.');
    //         }
    //       } else {
    //         console.error('No data found in the response.');
    //       }
    //     },
    //     (error) => {
    //       this.isLoadingRegistration = false;
    //       console.error('Error fetching students:', error);
    //       if (error.status === 401) {
    //         // Handle unauthorized error (e.g., redirect to login)
    //       }
    //     }
    //   );
    // }

    prepareChartData(studentsData: any[]) {
      const schoolCounts = studentsData.reduce((acc: Record<string, number>, student: any) => {
        const school = student.last_school_attended ? student.last_school_attended : 'Unknown';
        if (!acc[school]) {
          acc[school] = 0;
        }
        acc[school]++;
        return acc;
      }, {});

      // Convert the school object to an array of [key, value] pairs, sort by value, and split into top 5 and others
      const sortedSchools = (Object.entries(schoolCounts) as [string, number][])
        .sort((a, b) => b[1] - a[1]);
      const top5Schools = sortedSchools.slice(0, 5);
      const othersCount = sortedSchools.slice(5).reduce((acc, curr) => acc + curr[1], 0);

      // Prepare the final labels and data
      const labels = top5Schools.map(item => item[0]);
      const data = top5Schools.map(item => item[1]);

      if (othersCount > 0) {
        labels.push('Others');
        data.push(othersCount);
      }

      this.chartData = {
        labels: labels,
        datasets: [
          {
            data: data,
            backgroundColor: [
              '#FF6384', '#36A2EB', '#FFCE56', '#FF9F40', '#4BC0C0', '#9966FF', '#C9CBCF'
            ]
          }
        ]
      };

      this.chartOptions = {
        responsive: true,
        maintainAspectRatio: false
      };
    }


    civitStatusChartData(studentsData: any[]) {
      const civilCounts = studentsData.reduce((acc: any, student: any) => {
        const civil = student.civil_status ? student.civil_status : 'Unknown';
        if (!acc[civil]) {
          acc[civil] = 0;
        }
        acc[civil]++;
        return acc;
      }, {});

      this.civilStatusData = {
        labels: Object.keys(civilCounts),
        datasets: [
          {
            data: Object.values(civilCounts),
            backgroundColor: [
              '#FF6384', '#36A2EB', '#FFCE56', '#FF9F40', '#4BC0C0', '#9966FF', '#C9CBCF'
            ]
          }
        ]
      };

      this.chartOptions = {
        responsive: true,
        maintainAspectRatio: false
      };
    }

    AddressChartData(studentsData: any[]) {
      const studentAddress = studentsData.reduce((acc: Record<string, number>, student: any) => {
        const address = student.address ? student.address : 'Unknown';
        if (!acc[address]) {
          acc[address] = 0;
        }
        acc[address]++;
        return acc;
      }, {});

      // Convert the address object to an array of [key, value] pairs, sort by value, and split into top 5 and others
      const sortedAddresses = (Object.entries(studentAddress) as [string, number][])
        .sort((a, b) => b[1] - a[1]);
      const top5Addresses = sortedAddresses.slice(0, 5);
      const othersCount = sortedAddresses.slice(5).reduce((acc, curr) => acc + curr[1], 0);

      // Prepare the final labels and data
      const labels = top5Addresses.map(item => item[0]);
      const data = top5Addresses.map(item => item[1]);

      if (othersCount > 0) {
        labels.push('Others');
        data.push(othersCount);
      }

      this.addressData = {
        labels: labels,
        datasets: [
          {
            data: data,
            backgroundColor: [
              '#FF6384', '#36A2EB', '#FFCE56', '#FF9F40', '#4BC0C0', '#9966FF', '#C9CBCF'
            ]
          }
        ]
      };

      this.chartOptions = {
        responsive: true,
        maintainAspectRatio: false
      };
    }


    prepareRegistrationChartData(studentsData: any[]) {
      const registrationCounts = studentsData.reduce((acc: Record<string, number>, student: any) => {
        const date = moment(student.created_on).format('YYYY-MM-DD');
        if (!acc[date]) {
          acc[date] = 0;
        }
        acc[date]++;
        return acc;
      }, {});

      const labels = Object.keys(registrationCounts).sort();
      const data = labels.map(label => registrationCounts[label]);

      this.registrationChartData = {
        labels: labels,
        datasets: [
          {
            label: 'Registrations',
            data: data,
            fill: false,
            borderColor: '#42A5F5',
            tension: 0.4
          }
        ]
      };

      this.lineChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'day'
            }
          },
          y: {
            beginAtZero: true
          }
        }
      };
    }

}
