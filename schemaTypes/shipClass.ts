import {defineType, defineField} from 'sanity'
import {TagIcon} from '@sanity/icons'

export const shipClass = defineType({
  name: 'shipClass',
  title: 'Ship Class',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      description: 'e.g. Galaxy, Constitution, Defiant, Intrepid',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'title'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      type: 'text',
      rows: 3,
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'description'},
  },
})
