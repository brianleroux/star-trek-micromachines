import {defineType, defineField, defineArrayMember} from 'sanity'
import {RocketIcon} from '@sanity/icons'

export const starship = defineType({
  name: 'starship',
  title: 'Starship',
  type: 'document',
  icon: RocketIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Ship Name',
      type: 'string',
      description: 'e.g. USS Enterprise',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'registry',
      title: 'Registry Number',
      type: 'string',
      description: 'e.g. NCC-1701-D',
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'name'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'shipClass',
      title: 'Ship Class',
      type: 'reference',
      to: [{type: 'shipClass'}],
    }),
    defineField({
      name: 'era',
      type: 'reference',
      to: [{type: 'era'}],
    }),
    defineField({
      name: 'affiliation',
      title: 'Affiliation',
      type: 'string',
      options: {
        list: [
          {title: 'Starfleet', value: 'starfleet'},
          {title: 'Klingon Empire', value: 'klingon'},
          {title: 'Romulan Star Empire', value: 'romulan'},
          {title: 'Cardassian Union', value: 'cardassian'},
          {title: 'Borg Collective', value: 'borg'},
          {title: 'Dominion', value: 'dominion'},
          {title: 'Ferengi Alliance', value: 'ferengi'},
          {title: 'Other', value: 'other'},
        ],
        layout: 'dropdown',
      },
    }),
    defineField({
      name: 'image',
      title: 'Ship Image',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alt Text',
        }),
      ],
    }),
    defineField({
      name: 'excerpt',
      title: 'Short Description',
      type: 'text',
      rows: 3,
      description: 'Brief summary shown on the index page',
      validation: (rule) => rule.max(300),
    }),
    defineField({
      name: 'body',
      title: 'Full Article',
      type: 'array',
      of: [
        defineArrayMember({type: 'block'}),
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({
              name: 'alt',
              type: 'string',
              title: 'Alt Text',
            }),
            defineField({
              name: 'caption',
              type: 'string',
              title: 'Caption',
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'microMachines',
      title: 'Micro Machines Info',
      type: 'object',
      fields: [
        defineField({
          name: 'collectionNumber',
          title: 'Collection Number',
          type: 'string',
        }),
        defineField({
          name: 'scale',
          type: 'string',
        }),
        defineField({
          name: 'releaseYear',
          title: 'Release Year',
          type: 'number',
        }),
        defineField({
          name: 'notes',
          type: 'text',
          rows: 3,
          description: 'Rarity, variants, packaging notes, etc.',
        }),
      ],
    }),
    defineField({
      name: 'featured',
      title: 'Featured Ship',
      type: 'boolean',
      initialValue: false,
      description: 'Show prominently on the homepage',
    }),
  ],
  orderings: [
    {
      title: 'Name A-Z',
      name: 'nameAsc',
      by: [{field: 'name', direction: 'asc'}],
    },
    {
      title: 'Registry',
      name: 'registryAsc',
      by: [{field: 'registry', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'registry',
      media: 'image',
    },
    prepare({title, subtitle, media}) {
      return {
        title: title || 'Unnamed Ship',
        subtitle: subtitle || 'No registry',
        media,
      }
    },
  },
})
