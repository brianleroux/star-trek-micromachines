import type {StructureResolver} from 'sanity/structure'

const SINGLETONS = ['siteSettings']

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Star Trek Micro Machines')
    .items([
      S.listItem()
        .title('Site Settings')
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
            .title('Site Settings'),
        ),
      S.divider(),
      S.documentTypeListItem('starship').title('Starships'),
      S.documentTypeListItem('shipClass').title('Ship Classes'),
      S.documentTypeListItem('era').title('Eras'),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => !SINGLETONS.includes(item.getId() as string) &&
          !['starship', 'shipClass', 'era'].includes(item.getId() as string),
      ),
    ])
