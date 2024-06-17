import {Controller, Get, Query, UseGuards} from '@nestjs/common';
import {ApiTags} from '@nestjs/swagger';
import {HasRoles} from '@/commons/decorators/roles.decorator';
import {AccessAuthGuard} from '@/commons/guards/jwt.guard';
import {RolesGuard} from '@/commons/guards/roles.guard';
import {GetOrdersStatisticsResponse, OrdersStatisticParamsI} from '@/types/dashboard';
import {UserRole} from '../auth/model/user.model';
import {CartSwagger} from '../cart/swagger/cart.swagger';
import {DashboardService} from './dashboard.service';

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('/orders-statistic')
  @HasRoles([UserRole.ADMIN])
  @UseGuards(AccessAuthGuard, RolesGuard)
  @CartSwagger.getCart()
  async getOrdersStatistic(@Query() query: OrdersStatisticParamsI): Promise<GetOrdersStatisticsResponse['data']> {
    return this.dashboardService.getOrdersStatistic(query.timeline);
  }
}
