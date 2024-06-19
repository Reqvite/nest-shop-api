import {applyDecorators, HttpStatus} from '@nestjs/common';
import {ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse} from '@nestjs/swagger';
import {SuccessMessages} from '@/const/success.const';
import {GetOrdersGeoResponse, GetOrdersStatisticsResponse} from '@/types/dashboard';

export const DashboardSwagger = {
  getOrdersStatistic: () =>
    applyDecorators(
      ApiBearerAuth(),
      ApiOperation({summary: 'Get orders statistic'}),
      ApiResponse({status: HttpStatus.OK, description: SuccessMessages.SUCCESS, type: GetOrdersStatisticsResponse}),
      ApiQuery({name: 'timeline', type: 'string', required: false})
    ),
  getOrdersGeo: () =>
    applyDecorators(
      ApiBearerAuth(),
      ApiOperation({summary: 'Get orders geo'}),
      ApiResponse({status: HttpStatus.OK, description: SuccessMessages.SUCCESS, type: GetOrdersGeoResponse})
    )
};
