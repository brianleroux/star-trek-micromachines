import {defineBlueprint, defineDocumentFunction} from '@sanity/blueprints'

export default defineBlueprint({
  resources: [
    defineDocumentFunction({
      name: 'rebuild-site',
      event: {
        on: ['create', 'update'],
        filter: '_type == "starship"',
        projection: '{_id, name, registry}',
      },
    }),
  ],
})