import {ApiProperty} from '@nestjs/swagger';
import {getOrdersStatisticPipeline} from '@/entities/dashboard/pipelines/getOrdersStatistic.pipeline';
import {TimeLine} from '@/enums/timeLine.enum';

interface StatisticI {
  orders: number;
  sales: number;
  indexBy: string;
  month?: string;
  quarter?: string;
  week?: string;
}

export interface OrdersStatisticParamsI {
  timeline?: TimeLine;
}

export class GetOrdersStatisticsResponse {
  @ApiProperty({type: () => [getOrdersStatisticPipeline]})
  data: StatisticI[];
}
