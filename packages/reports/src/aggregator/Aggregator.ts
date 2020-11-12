import { Aggregator as BaseAggregator } from '@tupaia/aggregator';
import { QueryBuilder } from './QueryBuilder';
import { buildAggregationOptions } from './buildAggregationOptions';

export class Aggregator extends BaseAggregator {
  constructor(dataBroker, routeHandler) {
    super(dataBroker);
    this.routeHandler = routeHandler;
  }

  async fetchAnalytics(
    dataElementCodes,
    originalQuery,
    replacementValues,
    initialAggregationOptions = {},
  ) {
    const queryBuilder = new QueryBuilder(originalQuery, replacementValues, this.routeHandler);
    // const dataSourceEntities = await queryBuilder.getDataSourceEntities();
    const hierarchyId = await fetchHierarchyId(this.dataBroker.models, originalQuery);

    const fetchOptions = await queryBuilder.build();

    const entityAggregationOptions = queryBuilder.getEntityAggregationOptions();
    const aggregationOptions = await buildAggregationOptions(
      initialAggregationOptions,
      [],
      entityAggregationOptions,
      hierarchyId,
    );

    return super.fetchAnalytics(dataElementCodes, fetchOptions, aggregationOptions);
  }

  async fetchEvents(programCode, originalQuery, replacementValues) {
    const queryBuilder = new QueryBuilder(originalQuery, replacementValues, this.routeHandler);
    // const dataSourceEntities = await queryBuilder.getDataSourceEntities();
    const hierarchyId = await fetchHierarchyId(this.dataBroker.models, originalQuery);

    // queryBuilder.replaceOrgUnitCodes(dataSourceEntities);
    queryBuilder.makeEventReplacements();

    const entityAggregationOptions = queryBuilder.getEntityAggregationOptions();
    const aggregationOptions = await buildAggregationOptions(
      {}, // No input aggregation for events (yet)
      // dataSourceEntities,
      entityAggregationOptions,
      hierarchyId,
    );

    return super.fetchEvents(programCode, queryBuilder.getQuery(), aggregationOptions);
  }
}

const fetchHierarchyId = async (models, query) => {
  return (await models.project.findOne({ code: query.projectCode })).entity_hierarchy_id;
};