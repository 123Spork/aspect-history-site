import { Storage } from '@google-cloud/storage'
import fs from 'fs'
export type FileRecord = Record<string, unknown>

const getFileStructure = (
  paths: string[],
  fullPath: string,
  baseobj: FileRecord
): FileRecord => {
  const pathName = paths[0]
  paths.splice(0, 1)
  if (pathName.length > 0) {
    baseobj[pathName] =
      paths.length > 0
        ? Object.assign(
            baseobj[pathName] || {},
            getFileStructure(
              paths,
              fullPath,
              (baseobj[pathName] as FileRecord) || {}
            )
          )
        : `https://storage.googleapis.com/aspect-history-resources/${fullPath}`
  }
  return baseobj
}

export const collectFileRecord = async (): Promise<FileRecord> => {
  const storage = new Storage()
  const [files] = await storage.bucket('aspect-history-resources').getFiles()
  let obj = {}
  for (let i = 0; i < files.length; i++) {
    const paths = files[i].name.split('/')
    obj = getFileStructure(paths, files[i].name, obj)
  }
  return obj
}

const main = async() =>{
  const fileData = await collectFileRecord()
  fs.writeFileSync('./src/fileManager.json', JSON.stringify(fileData))
}

main()