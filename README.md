# SFDX Project Boilerplate for Remote Development(VSCode Extension)

This is created by blow commads.

```bash
sfdx force:project:create -n <project_name> --manifest
```

## Requirements

* Docker
* VSCode
* VSCode Extensions
  * Remote Development

## Install

```bash
git clone https://github.com/skysan87/sfdx-docker-template.git <project_name>
```

## Starting Development

Start SFDX project in Dev Conteiner(VSCode):

1. (Only Windows) Open Folder in WSL.
2. Open command palette and run `Dev Containers: Open Folder in Container`.
3. After the container is built, authorize your org. (ex. run `SFDX: Authorize an org`)
