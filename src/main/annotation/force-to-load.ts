import { getMetadataArgsStorage } from 'typeorm';

export const FORCE_TO_LOAD_KEY = 'force_to_load';

export function ForceToLoad(): PropertyDecorator {
  return (target: Object, propertyKey: string | symbol) => {
    Reflect.defineMetadata(
      FORCE_TO_LOAD_KEY,
      true,
      target,
      propertyKey
    );
  };
}

export function getForceToLoadProperties(entityClass: any): { property: string, parentAlias: string }[] {

  const properties: { property: string, parentAlias: string }[] = [];

  function getPropertiesRecursive(targetClass: any, prefix: string = ''): { property: string, parentAlias: string }[] {

    const props: { property: string, parentAlias: string }[] = [];

    const typeormMetadata = getMetadataArgsStorage();
    const columns = typeormMetadata.columns.filter(col => col.target === targetClass);
    const relations = typeormMetadata.relations.filter(rel => rel.target === targetClass);

    const allProperties = [
      ...columns.map(col => col.propertyName),
      ...relations.map(rel => rel.propertyName)
    ];

    allProperties.forEach(prop => {

      const hasForceToLoad = Reflect.getMetadata(
        FORCE_TO_LOAD_KEY,
        targetClass.prototype,
        prop
      );

      if (hasForceToLoad) {

        props.push({ property: prop, parentAlias: prefix });

        const relation: any = relations.find(rel => rel.propertyName === prop);

        const relationType = relation?.type();

        if (relationType && typeof relationType === 'function') {
          const nestedProps = getPropertiesRecursive(relationType, relation['propertyName'] + "_" + prefix);
          props.push(...nestedProps);
        }

      }
    });

    return props;
  }

  return getPropertiesRecursive(entityClass, 'entity');
}

