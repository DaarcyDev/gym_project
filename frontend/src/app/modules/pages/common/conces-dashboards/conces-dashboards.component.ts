import { DecimalPipe, NgFor, CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts';
import { Subject, takeUntil, tap } from 'rxjs';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginator } from '@angular/material/paginator';
import { MatDrawer, MatSidenav } from '@angular/material/sidenav';
import { MatSidenavModule } from '@angular/material/sidenav';
import { UserService } from 'app/core/user/user.service';
import { DashboardsService } from 'app/core/dashboards/dashboards.service';
import { User } from 'app/core/user/user.types';
import { PipesModule } from 'app/pipes/pipes.module';
@Component({
	selector: 'conces-dashboards',
	standalone: true,
	templateUrl: './conces-dashboards.component.html',
	styleUrls: ['./conces-dashboards.component.scss'],
	encapsulation: ViewEncapsulation.None,
	imports: [
		MatButtonModule,
		MatIconModule,
		MatMenuModule,
		MatButtonToggleModule,
		NgApexchartsModule,
		MatTooltipModule,
		NgFor,
		DecimalPipe,
		MatTabsModule,
		CurrencyPipe,
		MatTableModule,
		CommonModule,
		MatCheckboxModule,
		MatPaginator,
		MatDrawer,
		MatSidenavModule,
		PipesModule,
		MatSortModule
	],
})
export class ConcesDashboards {
	dashboardTableData: any;
	private _unsubscribeAll: Subject<any> = new Subject<any>();
	user: User;


	chartkmProgVskmCons: ApexOptions;
	chartKmLine: any;
	chartKmBus: any;
	linesRecordsNumber: Number;
	busRecordsNumber: Number;
	selectedTimeKmLines = '30 Dias';
	selectedTimeKmBus = '30 Dias';
	selectedTimeKmProgVsKmCons = '30 Dias';
	data: any
	borderStyle = "solid";
	borderWidth = "1px";

	displayedColumns: any;

	totalPages: any;
	pagination: any;
	lastPage: any;

	page: number = 0;
	elementsInPage: number = 10;
	elementsPerPage: number = 10;
	defaultRecords: number = 10;
	numTotal: number = 0;
	kmProgAvg: number = 0;
	KmConsAvg: number = 0;
	AmountAvg: number = 0;
	kmProgVskmConsMin: number = 0;
	kmProgVskmConsMax: number = 0;


	considerationsPaginadas: any = [];

	dataSource: MatTableDataSource<any> = new MatTableDataSource(this.considerationsPaginadas);

	@ViewChild(MatSort) sort: MatSort;
	@ViewChild(MatPaginator) paginator: MatPaginator;


	tableColumns = [
		{ 'id': 'name', 'name': 'Folio', 'key': 'name' },
		{ 'id': 'date', 'name': 'Fecha del gasto', 'key': 'date' },
		{ 'id': 'expense_type_name', 'name': 'Tipo de gasto', 'key': 'expense_type_name' },
		{ 'id': 'linea_short_name', 'name': 'Línea relacionada', 'key': 'linea_short_name' },
		{ 'id': 'total_amount', 'name': 'Total', 'key': 'total_amount' },
		{ 'id': 'state_name', 'name': 'Estado', 'key': 'state_name' },
	];

	constructor(
		private router: Router,
		private userService: UserService,
		private dashboardsService: DashboardsService,
	) {
		localStorage.removeItem('filtersConsiderations');
		localStorage.removeItem('filtersConces');
		this.getData();
	}

	ngOnIt(): void {
	}

	ngOnChanges() {
		this.dataSource.data = this.considerationsPaginadas;
		this.dataSource.sort = this.sort;
		console.log(this.dataSource.data)
		// this.displayedColumns = this.tableColumns.map(col => col.id);
		// this.considerationsPaginadas = this.dashboardTableData.slice(0, this.defaultRecords);
		// this.numTotal = this.dashboardData?.num_expenses;
		// this.pageNum();
	}

	getData() {
		this.userService.user$.pipe(
			takeUntil(this._unsubscribeAll),
			tap((user) => this.user = user)
		).subscribe()

		this.dashboardsService.GetDashboards()
			.subscribe({
				next: (res) => {
					if (res?.result?.status == true) {
						this.data = res?.result?.data?.page;
						this.dashboardTableData = this.data?.expenses;
						this._prepareChartData();
						this.displayedColumns = this.tableColumns.map(col => col.id);
						this.considerationsPaginadas = this.dashboardTableData.slice(0, this.defaultRecords);
						this.dataSource.data = this.considerationsPaginadas;
						this.dataSource.sort = this.sort;
						this.dataSource.paginator = this.paginator;
						this.numTotal = this.data?.num_expenses;
						this.pageNum();
					}
				}
			})
	}

	showDetails(row: any) {
		this.router.navigate(['considerations/detail/', row], { queryParams: { origin: "home" }});
	}

	updateKmLinesData(period: 'thirty_days' | 'three_months' | 'twelve_months'): void {
		const selectedData = this.data.km_cons_per_line[period];
		this.chartKmLine.colors = selectedData.colors;
		this.chartKmLine.labels = selectedData.labels;
		this.chartKmLine.series = selectedData.series;
		this.linesRecordsNumber = selectedData.records_number;
		switch (period) {
			case 'thirty_days':
				this.selectedTimeKmLines = '30 Dias';
				break;
			case 'three_months':
				this.selectedTimeKmLines = '3 Meses';
				break;
			case 'twelve_months':
				this.selectedTimeKmLines = '12 Meses';
				break;
		}
	}

	updateKmBusData(period: 'thirty_days' | 'three_months' | 'twelve_months'): void {
		const selectedData = this.data.km_cons_per_bus[period];
		this.chartKmBus.colors = selectedData.colors;
		this.chartKmBus.labels = selectedData.labels;
		this.chartKmBus.series = selectedData.series;
		this.busRecordsNumber = selectedData.records_number;
		switch (period) {
			case 'thirty_days':
				this.selectedTimeKmBus = '30 Dias';
				break;
			case 'three_months':
				this.selectedTimeKmBus = '3 Meses';
				break;
			case 'twelve_months':
				this.selectedTimeKmBus = '12 Meses';
				break;
		}
	}

	updateKmProgVsKmCons(period: 'thirty_days' | 'three_months' | 'twelve_months'): void {
		switch (period) {
			case 'thirty_days':
				this.selectedTimeKmProgVsKmCons = '30 Dias';
				this.kmProgAvg = this.data.km_prog_vs_km_cons_data.thirty_days.avg_km_prog;
				this.KmConsAvg = this.data.km_prog_vs_km_cons_data.thirty_days.avg_km_cons;
				this.AmountAvg = this.data.km_prog_vs_km_cons_data.thirty_days.payment_amout;
				this.chartkmProgVskmCons.yaxis = {
					labels: {
						style: {
							colors: 'var(--fuse-text-secondary)',
						},
					},
					max: this.data.km_prog_vs_km_cons_data.thirty_days.max_value,
					min: this.data.km_prog_vs_km_cons_data.thirty_days.min_value,
					show: false,
					tickAmount: 5,
				}
				this.chartkmProgVskmCons.series = this.data.km_prog_vs_km_cons_data.thirty_days.series;
				break;
			case 'three_months':
				this.selectedTimeKmProgVsKmCons = '3 Meses';
				this.kmProgAvg = this.data.km_prog_vs_km_cons_data.three_months.avg_km_prog;
				this.KmConsAvg = this.data.km_prog_vs_km_cons_data.three_months.avg_km_cons;
				this.AmountAvg = this.data.km_prog_vs_km_cons_data.three_months.payment_amout;
				this.chartkmProgVskmCons.yaxis = {
					labels: {
						style: {
							colors: 'var(--fuse-text-secondary)',
						},
					},
					max: this.data.km_prog_vs_km_cons_data.three_months.max_value,
					min: this.data.km_prog_vs_km_cons_data.three_months.min_value,
					show: false,
					tickAmount: 5,
				}
				this.chartkmProgVskmCons.series = this.data.km_prog_vs_km_cons_data.three_months.series;
				break;
			case 'twelve_months':
				this.selectedTimeKmProgVsKmCons = '12 Meses';
				this.kmProgAvg = this.data.km_prog_vs_km_cons_data.twelve_months.avg_km_prog;
				this.KmConsAvg = this.data.km_prog_vs_km_cons_data.twelve_months.avg_km_cons;
				this.AmountAvg = this.data.km_prog_vs_km_cons_data.twelve_months.payment_amout;
				this.chartkmProgVskmCons.yaxis = {
					labels: {
						style: {
							colors: 'var(--fuse-text-secondary)',
					},
					},
					max: this.data.km_prog_vs_km_cons_data.twelve_months.max_value,
					min: this.data.km_prog_vs_km_cons_data.twelve_months.min_value,
							show: false,
								tickAmount: 5,
				}
				this.chartkmProgVskmCons.series = this.data.km_prog_vs_km_cons_data.twelve_months.series;
				break;
		}
	}

	getColumnValue(element: any, key: string): any {
		if (key === 'linea_id') {
			return element.linea?.name_short;
		} else {
			return element[key];
		}
	}

	//paginacion
	onPageChange($event): void {
		if ($event === -1) {
			if (this.page === 1) {
			} else {
				this.calculatePage(this.page, 'l');
				this.page = this.page - 1;
				this.considerationsPaginadas = this.dashboardTableData.slice((this.defaultRecords * (this.page - 1)), (this.defaultRecords * this.page));
				this.dataSource.data = this.considerationsPaginadas;
				this.dataSource.sort = this.sort;
				this.dataSource.paginator = this.paginator;
			}
		} else if ($event === 's') {
			if (this.page === this.lastPage) {
			} else {
				this.calculatePage(this.page, 'm');
				this.page = this.page + 1;
				this.considerationsPaginadas = this.dashboardTableData.slice((this.defaultRecords * (this.page - 1)), (this.defaultRecords * this.page));
				this.dataSource.data = this.considerationsPaginadas;
				this.dataSource.sort = this.sort;
				this.dataSource.paginator = this.paginator;
			}
		} else {
			if (this.page === $event) {
			} else {
				this.calculatePage(this.page, $event);
				this.page = $event;
				this.considerationsPaginadas = this.dashboardTableData.slice((this.defaultRecords * (this.page - 1)), (this.defaultRecords * this.page));
				this.dataSource.data = this.considerationsPaginadas;
				this.dataSource.sort = this.sort;
				this.dataSource.paginator = this.paginator;
			}
		}
	}

	calculatePage(page: number, action: any) {
		let fd;
		let ld;
		if (this.lastPage > 7) {
			if (action === 'm') {
				if (page === this.totalPages.length - 4) {
					fd = this.totalPages.slice(page - 1, page + 1);
					ld = this.totalPages.slice(-2);
					this.pagination = [fd[0], fd[1], "md", ld[0], ld[1]];
				} else if (page >= this.totalPages.length - 3) {
					fd = this.totalPages.slice(0, 1);
					ld = this.totalPages.slice(-3);
					this.pagination = [fd[0], "md", ld[0], ld[1], ld[2]];
				} else {
					fd = this.totalPages.slice(page, page + 2);
					ld = this.totalPages.slice(-2);
					this.pagination = [fd[0], fd[1], "md", ld[0], ld[1]];
				}
			} else if (action === 'l') {
				if (page === this.totalPages.length - 2) {
					fd = this.totalPages.slice(page - 3, page - 1);
					ld = this.totalPages.slice(-2);
					this.pagination = [fd[0], fd[1], "md", ld[0], ld[1]];
				} else if (page <= this.totalPages.length - 3) {
					fd = this.totalPages.slice(page - 2, page);
					ld = this.totalPages.slice(-2);
					this.pagination = [fd[0], fd[1], "md", ld[0], ld[1]];
				} else {
					fd = this.totalPages.slice(0, 1);
					ld = this.totalPages.slice(-3);
					this.pagination = [fd[0], "md", ld[0], ld[1], ld[2]];
				}
			} else if (action > page) {
				if (action === this.totalPages.length - 3) {
					fd = this.totalPages.slice(action - 2, action + 2);
					ld = this.totalPages.slice(-2);
					this.pagination = [fd[0], fd[1], "md", ld[0], ld[1]];
				} else if (action >= this.totalPages.length - 3) {
					fd = this.totalPages.slice(0, 1);
					ld = this.totalPages.slice(-3);
					this.pagination = [fd[0], "md", ld[0], ld[1], ld[2]];
				} else {
					fd = this.totalPages.slice(page, action + 2);
					ld = this.totalPages.slice(-2);
					this.pagination = [fd[0], fd[1], "md", ld[0], ld[1]];
				}
			} else if (action < page) {
				if (action === this.totalPages.length - 3) {
					fd = this.totalPages.slice(action - 3, action - 1);
					ld = this.totalPages.slice(-2);
					this.pagination = [fd[0], fd[1], "md", ld[0], ld[1]];
				} else if (action === 1) {
					fd = this.totalPages.slice(0, 2);
					ld = this.totalPages.slice(-2);
					this.pagination = [fd[0], fd[1], "md", ld[0], ld[1]];
				} else if (action <= this.totalPages.length - 3) {
					fd = this.totalPages.slice(action - 2, action);
					ld = this.totalPages.slice(-2);
					this.pagination = [fd[0], fd[1], "md", ld[0], ld[1]];
				} else {
					fd = this.totalPages.slice(0, 1);
					ld = this.totalPages.slice(-3);
					this.pagination = [fd[0], "md", ld[0], ld[1], ld[2]];
				}
			}
		}
	}

	pageNum() {
		//Inicializacion de la paginacion
		this.totalPages = Math.ceil(this.numTotal / this.elementsPerPage);

		this.page = 1;
		this.lastPage = this.totalPages;
		let tp = this.totalPages;
		let page = [];
		for (let j = 0; j < tp; j++) {
			page[j] = j + 1;
		}
		this.totalPages = page;

		//mostrado de botones
		if (tp > 7) {
			let fd = this.totalPages.slice(0, 2);
			let ld = this.totalPages.slice(-2);
			this.pagination = [fd[0], fd[1], "md", ld[0], ld[1]];
		}
		else {
			this.pagination = this.totalPages
		}
	}

	goToConsiderations() {
		this.router.navigate(['considerations/']);
	}

	private _prepareChartData(): void {
		this.kmProgAvg = this.data.km_prog_vs_km_cons_data.thirty_days.avg_km_prog;
		this.KmConsAvg = this.data.km_prog_vs_km_cons_data.thirty_days.avg_km_cons;
		this.AmountAvg = this.data.km_prog_vs_km_cons_data.thirty_days.payment_amout;
		this.kmProgVskmConsMin = this.data.km_prog_vs_km_cons_data.thirty_days.min_value;
		this.kmProgVskmConsMax = this.data.km_prog_vs_km_cons_data.thirty_days.max_value;
		this.chartkmProgVskmCons = {
			chart: {
				animations: {
					enabled: false,
				},
				fontFamily: 'inherit',
				foreColor: 'inherit',
				height: '100%',
				type: 'area',
				toolbar: {
					show: false,
				},
				zoom: {
					enabled: false,
				},
			},
			colors: ['#3182CE', '#63B3ED'],
			dataLabels: {
				enabled: false,
			},
			fill: {
				colors: ['#3182CE', '#63B3ED'],
				opacity: 0.5,
			},
			grid: {
				show: false,
				padding: {
					left: 20
				}
			},
			legend: {
				show: false,
			},
			series: this.data.km_prog_vs_km_cons_data.thirty_days.series,
			stroke: {
				curve: 'straight',
			},
			markers: {
				size: 6,
				hover: {
					size: 8
				}
			},
			tooltip: {
				followCursor: true,
				theme: 'dark',
				x: {
					format: 'MMM dd, yyyy',
				},
			},
			xaxis: {
				axisBorder: {
					show: false,
				},
				labels: {
					offsetY: -20,
					rotate: 0,
					style: {
						colors: 'var(--fuse-text-secondary)',
					},
				},
				tickAmount: 3,
				tooltip: {
					enabled: false,
				},
				type: 'datetime',
			},
			yaxis: {
				labels: {
					style: {
						colors: 'var(--fuse-text-secondary)',
					},
				},
				max: this.data.km_prog_vs_km_cons_data.thirty_days.max_value,
				min: this.data.km_prog_vs_km_cons_data.thirty_days.min_value,
				show: false,
				tickAmount: 5,
			},
		};
		this.chartKmLine = {
			chart: {
				animations: {
					speed: 400,
					animateGradually: {
						enabled: false,
					},
				},
				fontFamily: 'inherit',
				foreColor: 'inherit',
				height: '100%',
				type: 'donut',
				sparkline: {
					enabled: true,
				},
			},
			colors: this.data.km_cons_per_line.thirty_days.colors,
			labels: this.data.km_cons_per_line.thirty_days.labels,
			plotOptions: {
				pie: {
					customScale: 0.9,
					expandOnClick: false,
					donut: {
						size: '70%',
					},
				},
			},
			series: this.data.km_cons_per_line.thirty_days.series,
			records_number: this.data.km_cons_per_line.thirty_days.records_number,
			states: {
				hover: {
					filter: {
						type: 'none',
					},
				},
				active: {
					filter: {
						type: 'none',
					},
				},
			},
			tooltip: {
				enabled: true,
				fillSeriesColor: false,
				theme: 'dark',
				custom: ({
					seriesIndex,
					w,
				}): string => `<div class="flex items-center h-8 min-h-8 max-h-8 px-3">
                                                    <div class="w-3 h-3 rounded-full" style="background-color: ${w.config.colors[seriesIndex]};"></div>
                                                    <div class="ml-2 text-md leading-none">${w.config.labels[seriesIndex]}:</div>
                                                    <div class="ml-2 text-md font-bold leading-none">${w.config.series[seriesIndex]}%</div>
                                                </div>`,
			},
		};
		this.chartKmBus = {
			chart: {
				animations: {
					speed: 400,
					animateGradually: {
						enabled: false,
					},
				},
				fontFamily: 'inherit',
				foreColor: 'inherit',
				height: '100%',
				type: 'donut',
				sparkline: {
					enabled: true,
				},
			},
			colors: this.data.km_cons_per_bus.thirty_days.colors,
			labels: this.data.km_cons_per_bus.thirty_days.labels,
			plotOptions: {
				pie: {
					customScale: 0.9,
					expandOnClick: false,
					donut: {
						size: '70%',
					},
				},
			},
			series: this.data.km_cons_per_bus.thirty_days.series,
			records_number: this.data.km_cons_per_bus.thirty_days.records_number,
			states: {
				hover: {
					filter: {
						type: 'none',
					},
				},
				active: {
					filter: {
						type: 'none',
					},
				},
			},
			tooltip: {
				enabled: true,
				fillSeriesColor: false,
				theme: 'dark',
				custom: ({
					seriesIndex,
					w,
				}): string => `<div class="flex items-center h-8 min-h-8 max-h-8 px-3">
                                                    <div class="w-3 h-3 rounded-full" style="background-color: ${w.config.colors[seriesIndex]};"></div>
                                                    <div class="ml-2 text-md leading-none">${w.config.labels[seriesIndex]}:</div>
                                                    <div class="ml-2 text-md font-bold leading-none">${w.config.series[seriesIndex]}%</div>
                                                </div>`,
			},
		};

	}
}