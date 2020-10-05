/**
 * Tupaia
 * Copyright (c) 2017 - 2020 Beyond Essential Systems Pty Ltd
 */
import { reduceToDictionary } from '@tupaia/utils';
import { ORG_UNIT_ENTITY_TYPES } from '../modelClasses/Entity';

export class EntityHierarchyCacher {
  constructor(models) {
    this.models = models;
    this.generationsVisited = new Set();
  }

  async buildAndCacheAll() {
    // projects are the root entities of every full tree, so start with them
    const projects = await this.models.project.all();
    const projectTasks = projects.map(async project => this.buildAndCacheProject(project));
    await Promise.all(projectTasks);
  }

  async buildAndCacheProject(project) {
    const { entity_id: projectEntityId, entity_hierarchy_id: hierarchyId } = project;
    return this.fetchAndCacheDescendants(hierarchyId, { [projectEntityId]: [] });
  }

  /**
   * Recursively traverse the alternative hierarchy that begins with the specified parents.
   * At each generation, choose children via 'entity_relation' if any exist, or the canonical
   * entity.parent_id if none do
   * @param {string} hierarchyId             The specific hierarchy to follow through entity_relation
   * @param {string} parentIdsToAncestorIds  Keys are parent ids to fetch descendants of, values are
   *                                         all ancestor ids above each parent
   */
  async fetchAndCacheDescendants(hierarchyId, parentIdsToAncestorIds) {
    const parentIds = Object.keys(parentIdsToAncestorIds);

    // check whether next generation uses entity relation links, or should fall back to parent_id
    const entityRelationChildCount = await this.countEntityRelationChildren(hierarchyId, parentIds);
    const useEntityRelationLinks = entityRelationChildCount > 0;
    const childCount = useEntityRelationLinks
      ? entityRelationChildCount
      : await this.countCanonicalChildren(parentIds);

    if (childCount === 0) {
      return; // at a leaf node generation, no need to go any further
    }

    const childIdToAncestorIds = await this.fetchChildIdToAncestorIds(
      hierarchyId,
      parentIdsToAncestorIds,
      useEntityRelationLinks,
    );

    const childrenAlreadyCached = await this.checkChildrenAlreadyCached(
      hierarchyId,
      parentIds,
      childCount,
    );
    if (!childrenAlreadyCached) {
      await this.cacheGeneration(hierarchyId, childIdToAncestorIds);
    }

    // if there is another generation, keep recursing through the hierarchy
    await this.fetchAndCacheDescendants(hierarchyId, childIdToAncestorIds);
  }

  async checkChildrenAlreadyCached(hierarchyId, parentIds, childCount) {
    const numberChildrenCached = await this.models.ancestorDescendantRelation.count({
      entity_hierarchy_id: hierarchyId,
      ancestor_id: parentIds,
      generational_distance: 1,
    });
    return numberChildrenCached === childCount;
  }

  async fetchChildIdToAncestorIds(hierarchyId, parentIdsToAncestorIds, useEntityRelationLinks) {
    const parentIds = Object.keys(parentIdsToAncestorIds);
    const relations = useEntityRelationLinks
      ? await this.getRelationsViaEntityRelation(hierarchyId, parentIds)
      : await this.getRelationsCanonically(parentIds);
    const childIdToParentId = reduceToDictionary(relations, 'child_id', 'parent_id');
    const childIdToAncestorIds = Object.fromEntries(
      Object.entries(childIdToParentId).map(([childId, parentId]) => [
        childId,
        [parentId, ...parentIdsToAncestorIds[parentId]],
      ]),
    );
    return childIdToAncestorIds;
  }

  async countEntityRelationChildren(hierarchyId, entityIds) {
    return this.models.entityRelation.count({
      parent_id: entityIds,
      entity_hierarchy_id: hierarchyId,
    });
  }

  getCanonicalChildrenCriteria(parentIds) {
    const canonicalTypes = Object.values(ORG_UNIT_ENTITY_TYPES);
    return {
      parent_id: parentIds,
      type: canonicalTypes,
    };
  }

  async countCanonicalChildren(parentIds) {
    const criteria = this.getCanonicalChildrenCriteria(parentIds);
    return this.models.entity.count(criteria);
  }

  async getRelationsViaEntityRelation(hierarchyId, parentIds) {
    // get any matching alternative hierarchy relationships leading out of these parents
    return this.models.entityRelation.find({
      parent_id: parentIds,
      entity_hierarchy_id: hierarchyId,
    });
  }

  async getRelationsCanonically(parentIds) {
    const criteria = this.getCanonicalChildrenCriteria(parentIds);
    const children = await this.models.entity.find(criteria, { columns: ['id', 'parent_id'] });
    return children.map(c => ({ child_id: c.id, parent_id: c.parent_id }));
  }

  /**
   * Stores the generation of ancestor/descendant info in the database
   * @param {string} hierarchyId
   * @param {Entity[]} childIdToAncestorIds   Ids of the child entities as keys, with the ids of their
   *                                          ancestors in order of generational distance, with immediate
   *                                          parent at index 0
   */
  async cacheGeneration(hierarchyId, childIdToAncestorIds) {
    const records = [];
    Object.entries(childIdToAncestorIds).forEach(([childId, ancestorIds]) => {
      ancestorIds.forEach((ancestorId, ancestorIndex) =>
        records.push({
          entity_hierarchy_id: hierarchyId,
          ancestor_id: ancestorId,
          descendant_id: childId,
          generational_distance: ancestorIndex + 1,
        }),
      );
    });
    await this.models.ancestorDescendantRelation.createMany(records);
  }
}