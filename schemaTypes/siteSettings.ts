import {defineType, defineField} from 'sanity'
import {CogIcon} from '@sanity/icons'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Site Title',
      type: 'string',
      initialValue: 'Star Trek Micro Machines Database',
    }),
    defineField({
      name: 'tagline',
      type: 'string',
      initialValue: 'A comprehensive guide to the fleet in miniature',
    }),
    defineField({
      name: 'stardatePrefix',
      title: 'Stardate Prefix',
      type: 'string',
      description: 'Displayed in the LCARS header bar',
      initialValue: '47988.1',
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Site Settings'}
    },
  },
})
