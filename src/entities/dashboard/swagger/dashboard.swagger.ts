import {applyDecorators, HttpStatus} from '@nestjs/common';
import {ApiOperation, ApiQuery, ApiResponse} from '@nestjs/swagger';
import {SuccessMessages} from '@/const/success.const';
import {GetOrdersStatisticsResponse} from '@/types/dashboard';

export const DashboardSwagger = {
  getOrdersStatistic: () =>
    applyDecorators(
      ApiOperation({summary: 'Get orders statistic'}),
      ApiResponse({status: HttpStatus.OK, description: SuccessMessages.SUCCESS, type: GetOrdersStatisticsResponse}),
      ApiQuery({name: 'page', type: 'string', required: false})
    )
};
