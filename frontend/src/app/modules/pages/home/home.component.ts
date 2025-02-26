import { CurrencyPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { ApexOptions, NgApexchartsModule, ApexAxisChartSeries } from 'ng-apexcharts';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatRippleModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { Subject, takeUntil } from 'rxjs';

@Component({
	selector: 'home',
	standalone: true,
	templateUrl: './home.component.html',
	encapsulation: ViewEncapsulation.None,
	imports: [RouterLink, FuseAlertComponent, NgIf, NgFor, FormsModule, ReactiveFormsModule, MatTableModule, MatRippleModule, MatRippleModule, MatButtonToggleModule, MatMenuModule, MatFormFieldModule, MatTabsModule, MatInputModule, MatButtonModule, MatIconModule, MatCheckboxModule, MatProgressSpinnerModule],
})
export class HomeComponent {
	/**
	 * Constructor
	 */
	chartGithubIssues: ApexOptions = {};
	chartTaskDistribution: ApexOptions = {};
	private _unsubscribeAll: Subject<any> = new Subject<any>();
	data= {
		githubIssues: {
			labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
			overview: {
				'this-week': {
					'closed-issues': 72,
					'fixed': 6,
					'needs-triage': 5,
					'new-issues': 197,
					're-opened': 6,
					'wont-fix': 11
				},
				'last-week': {
					'closed-issues': 75,
					'fixed': 3,
					'needs-triage': 6,
					'new-issues': 214,
					're-opened': 8,
					'wont-fix': 4
				}
			},
			series: {
				'this-week': [
					{
						name: 'New issues',
						type: 'line',
						data: [42, 28, 43, 34, 20, 25, 22],
					},
					{
						name: 'Closed issues',
						type: 'column',
						data: [11, 10, 8, 11, 8, 10, 17],
					},
				],
				'last-week': [
					{
						name: 'New issues',
						type: 'line',
						data: [37, 32, 39, 27, 18, 24, 20],
					},
					{
						name: 'Closed issues',
						type: 'column',
						data: [9, 8, 10, 12, 7, 11, 15],
					},
				],
			}
		},
		taskDistribution: {
			labels: ['API', 'Backend', 'Frontend', 'Issues'],
			overview: {
				'this-week': {
					completed: 260,
					new: 526
				},
				'last-week': {
					completed: 287,
					new: 594
				}
			},
			series: {
				'last-week': [15, 20, 38, 27],
				'this-week': [19, 16, 42, 23],
			},
		},
		schedule: {
			today: [
				{ location: 'Conference room 1B', time: 'in 32 minutes', title: 'Group Meeting' },
				{ time: '10:30 AM', title: 'Coffee Break' },
				{ time: '11:00 AM', title: 'Public Beta Release' },
				{ time: '12:10 PM', title: 'Lunch' },
				{ location: 'Magnolia', time: '05:30 PM', title: 'Dinner with David' },
				{ location: 'Home', time: '07:30 PM', title: "Jane's Birthday Party" },
				{ location: "Overseer's room", time: '09:30 PM', title: "Overseer's Retirement Party" }
			],
			tomorrow: [
				{ location: 'Conference room 1A', time: '09:00 AM', title: 'Marketing Meeting' },
				{ time: '11:00 AM', title: 'Public Announcement' },
				{ time: '12:10 PM', title: 'Lunch' },
				{ location: 'Conference room 2C', time: '03:00 PM', title: 'Meeting with Beta Testers' },
				{ time: '05:30 PM', title: 'Live Stream' },
				{ location: "CEO's house", time: '07:30 PM', title: 'Release Party' },
				{ location: "CEO's Penthouse", time: '09:30 PM', title: "CEO's Private Party" }
			]
		}
	};

	constructor(
		private _authService: AuthService,
		private _router: Router,
	) {
	}

	ngOnIt() : void
	{
		// Get the data
		this._prepareChartData();

		window['Apex'] = {
			chart: {
				events: {
					mounted: (chart: any, options?: any): void => {
						this._fixSvgFill(chart.el);
					},
					updated: (chart: any, options?: any): void => {
						this._fixSvgFill(chart.el);
					},
				},
			},
		};
	}

	private _fixSvgFill(element: Element): void {
		// Current URL
		const currentURL = this._router.url;

		// 1. Find all elements with 'fill' attribute within the element
		// 2. Filter out the ones that doesn't have cross reference so we only left with the ones that use the 'url(#id)' syntax
		// 3. Insert the 'currentURL' at the front of the 'fill' attribute value
		Array.from(element.querySelectorAll('*[fill]'))
			.filter(el => el.getAttribute('fill').indexOf('url(') !== -1)
			.forEach((el) => {
				const attrVal = el.getAttribute('fill');
				el.setAttribute('fill', `url(${currentURL}${attrVal.slice(attrVal.indexOf('#'))}`);
			});
	}

	private _prepareChartData(): void {
		// Github issues
		this.chartGithubIssues = {
			chart: {
				fontFamily: 'inherit',
				foreColor: 'inherit',
				height: '100%',
				type: 'line',
				toolbar: {
					show: false,
				},
				zoom: {
					enabled: false,
				},
			},
			colors: ['#64748B', '#94A3B8'],
			dataLabels: {
				enabled: true,
				enabledOnSeries: [0],
				background: {
					borderWidth: 0,
				},
			},
			grid: {
				borderColor: 'var(--fuse-border)',
			},
			labels: this.data.githubIssues.labels,
			legend: {
				show: false,
			},
			plotOptions: {
				bar: {
					columnWidth: '50%',
				},
			},
			//series: this.data.githubIssues.series,
			states: {
				hover: {
					filter: {
						type: 'darken',
						value: 0.75,
					},
				},
			},
			stroke: {
				width: [3, 0],
			},
			tooltip: {
				followCursor: true,
				theme: 'dark',
			},
			xaxis: {
				axisBorder: {
					show: false,
				},
				axisTicks: {
					color: 'var(--fuse-border)',
				},
				labels: {
					style: {
						colors: 'var(--fuse-text-secondary)',
					},
				},
				tooltip: {
					enabled: false,
				},
			},
			yaxis: {
				labels: {
					offsetX: -16,
					style: {
						colors: 'var(--fuse-text-secondary)',
					},
				},
			},
		};

		// Task distribution
		this.chartTaskDistribution = {
			chart: {
				fontFamily: 'inherit',
				foreColor: 'inherit',
				height: '100%',
				type: 'polarArea',
				toolbar: {
					show: false,
				},
				zoom: {
					enabled: false,
				},
			},
			labels: this.data.taskDistribution.labels,
			legend: {
				position: 'bottom',
			},
			plotOptions: {
				polarArea: {
					spokes: {
						connectorColors: 'var(--fuse-border)',
					},
					rings: {
						strokeColor: 'var(--fuse-border)',
					},
				},
			},
			//series: this.data.taskDistribution.series,
			states: {
				hover: {
					filter: {
						type: 'darken',
						value: 0.75,
					},
				},
			},
			stroke: {
				width: 2,
			},
			theme: {
				monochrome: {
					enabled: true,
					color: '#93C5FD',
					shadeIntensity: 0.75,
					shadeTo: 'dark',
				},
			},
			tooltip: {
				followCursor: true,
				theme: 'dark',
			},
			yaxis: {
				labels: {
					style: {
						colors: 'var(--fuse-text-secondary)',
					},
				},
			},
		};
	}
}