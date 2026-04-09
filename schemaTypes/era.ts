import {defineType, defineField} from 'sanity'
import {CalendarIcon} from '@sanity/icons'

export const era = defineType({
  name: 'era',
  title: 'Era',
  type: 'document',
  icon: CalendarIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'title'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sort Order',
      type: 'number',
      description: 'Lower numbers appear first (e.g. TOS=1, TNG=2, DS9=3)',
    }),
  ],
  preview: {
    select: {title: 'title'},
  },
})
