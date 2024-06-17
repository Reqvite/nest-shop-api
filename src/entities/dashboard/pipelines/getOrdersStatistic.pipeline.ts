import {PipelineStage} from 'mongoose';
import {monthNames} from '@/const/monthNames';
import {Quarter} from '@/enums/quarter.enum';

const getGroup = () => {
  return {
    sales: {
      $sum: '$totalPrice'
    },
    orders: {
      $sum: 1
    }
  };
};

const baseProjectOptions = {
  sales: {$round: [{$divide: ['$sales', 1]}, 2]},
  orders: 1
};

export const getOrdersStatisticPipeline = {
  monthly: (): PipelineStage[] => [
    {
      $group: {
        _id: {
          month: {
            $month: '$createdAt'
          }
        },
        ...getGroup()
      }
    },
    {
      $sort: {
        '_id.month': 1
      }
    },
    {
      $project: {
        _id: 0,
        month: {
          $arrayElemAt: [monthNames, {$subtract: ['$_id.month', 1]}]
        },
        indexBy: 'month',
        ...baseProjectOptions
      }
    }
  ],
  weekly: (): PipelineStage[] => [
    {
      $group: {
        _id: {$week: '$createdAt'},
        ...getGroup()
      }
    },
    {
      $sort: {
        _id: 1
      }
    },
    {
      $project: {
        _id: 0,
        week: {$toString: '$_id'},
        indexBy: 'week',
        ...baseProjectOptions
      }
    }
  ],
  quarterly: (): PipelineStage[] => [
    {
      $project: {
        quarter: {
          $cond: [
            {$lte: [{$month: '$createdAt'}, 3]},
            Quarter.Q1,
            {
              $cond: [
                {$lte: [{$month: '$createdAt'}, 6]},
                Quarter.Q2,
                {
                  $cond: [{$lte: [{$month: '$createdAt'}, 9]}, Quarter.Q3, Quarter.Q4]
                }
              ]
            }
          ]
        },
        ...getGroup()
      }
    },
    {
      $group: {
        _id: '$quarter',
        sales: {$sum: '$sales'},
        orders: {$sum: '$orders'}
      }
    },
    {
      $project: {
        _id: 0,
        quarter: '$_id',
        indexBy: 'quarter',
        ...baseProjectOptions
      }
    },
    {
      $sort: {
        quarter: 1
      }
    }
  ]
};
