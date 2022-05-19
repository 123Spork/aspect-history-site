import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Card, Container, Navbar } from 'react-bootstrap'
import './main.scss'
import fileRecord from './fileManager.json'
import uuid from 'react-uuid'

export type FileRecord = Record<string, unknown>

const Folder = ({ folder }: { folder: FileRecord }): any => {
  return (
    <div className="folder-header">
      {Object.keys(folder)
        .sort((a, b) => {
          return a.localeCompare(b, undefined, {
            numeric: true,
            sensitivity: 'base'
          })
        })
        .map((key: string): any => {
          const id = uuid()
          return (
            <div className="folder-body">
              {typeof folder[key] === 'string' ? (
                <a href={folder[key] as string} target="_blank">
                  {key}
                </a>
              ) : (
                <div>
                  <button
                    className="directory-button"
                    onClick={() => {
                      ;(document.getElementById(
                        id
                      ) as HTMLElement).classList.toggle('hide')
                    }}
                  >
                    ⇒
                  </button>
                  {key as string}{' '}
                  <div id={id} className="hide">
                    <Folder folder={folder[key] as FileRecord} />
                  </div>
                </div>
              )}
            </div>
          )
        })}
    </div>
  )
}

class Main extends React.Component {
  render(): any {
    console.log(fileRecord)

    return (
      <Container>
        <Navbar bg="light" expand="lg">
          <Navbar.Brand href="#home">AspectHistory</Navbar.Brand>
        </Navbar>
        <Card>
          <Card.Header>File Resources</Card.Header>
          <Card.Body>
            <Folder folder={fileRecord} />
          </Card.Body>
        </Card>
      </Container>
    )
  }
}
ReactDOM.render(<Main />, document.getElementById('app'))
