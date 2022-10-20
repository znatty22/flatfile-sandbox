import {
  Portal,
  Sheet,
  TextField,
  Workbook,
  Message,
} from '@flatfile/configure'

export const protocols: Record<string, string> = {
  S3: 's3://',
}

const ManifestEntries = new Sheet(
  'File Upload Manifest',
  {
    fileExternalId: TextField({
      required: false,
      label: 'File ID',
      description:
        'Submitter provided unique identifier for the purpose of linking the file to its sample and/or patient',
    }),
    location: TextField({
      required: true,
      label: 'Location',
      description:
        'The fully qualified object URI in the cloud (e.g. s3://mybucket/myfolder/myfile.tsv)',
      validate: (location: string) => {
        let validUrl: URL | null = null
        try {
          validUrl = new URL(location)
        } catch {
          validUrl = null
        }
        if (
          !Object.values(protocols).some((protocol) =>
            location.startsWith(protocol)
          ) ||
          !validUrl
        ) {
          return [
            new Message(
              'Location must be a fully qualified object uri (e.g. s3://mybucket/myfolder/myfile.tsv)',
              'error',
              'validate'
            ),
          ]
        }
      },
    }),
    hash: TextField({
      required: true,
      label: 'Hash',
      description:
        'The content based file hash (e.g. 6e7e51484276a1101158af8a833ce7cc)',
    }),
  },
  {
    allowCustomFields: true,
    readOnly: false,
  }
)

const ManifestEntriesPortal = new Portal({
  name: 'File Upload Manifest Portal',
  sheet: 'ManifestEntries',
})

export default new Workbook({
  name: 'Dewrangle',
  namespace: 'dewrangle',
  sheets: {
    ManifestEntries,
  },
  portals: [ManifestEntriesPortal],
})
