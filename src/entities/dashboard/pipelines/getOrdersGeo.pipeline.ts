import {PipelineStage} from 'mongoose';

export const getOrdersGeo: PipelineStage[] = [
  {
    $unwind: '$billingInfo'
  },
  {
    $match: {
      'billingInfo.label': 'iso3'
    }
  },
  {
    $group: {
      _id: '$billingInfo.value',
      orders: {$sum: 1}
    }
  },
  {
    $group: {
      _id: null,
      min: {$min: '$orders'},
      max: {$max: '$orders'},
      values: {$push: {id: '$_id', value: '$orders'}}
    }
  },
  {
    $project: {
      _id: 0,
      domain: ['$min', '$max'],
      values: 1
    }
  }
];
