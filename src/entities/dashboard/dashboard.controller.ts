import {Controller, Get, Query, UseGuards} from '@nestjs/common';
import {ApiTags} from '@nestjs/swagger';
import {HasRoles} from '@/commons/decorators/roles.decorator';
import {AccessAuthGuard} from '@/commons/guards/jwt.guard';
import {RolesGuard} from '@/commons/guards/roles.guard';
import {GetOrdersGeoResponse, GetOrdersStatisticQueryParamsI, GetOrdersStatisticsResponse} from '@/types/dashboard';
import {UserRole} from '../auth/model/user.model';
import {DashboardService} from './dashboard.service';
import {DashboardSwagger} from './swagger/dashboard.swagger';

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('/orders-statistic')
  @HasRoles([UserRole.ADMIN])
  @UseGuards(AccessAuthGuard, RolesGuard)
  @DashboardSwagger.getOrdersStatistic()
  async getOrdersStatistic(
    @Query() query: GetOrdersStatisticQueryParamsI
  ): Promise<GetOrdersStatisticsResponse['data']> {
    return this.dashboardService.getOrdersStatistic(query.timeline);
  }

  @Get('/orders-geo')
  @HasRoles([UserRole.ADMIN])
  @UseGuards(AccessAuthGuard, RolesGuard)
  @DashboardSwagger.getOrdersGeo()
  async getOrdersGeo(): Promise<GetOrdersGeoResponse> {
    return this.dashboardService.getOrdersGeo();
  }
}
