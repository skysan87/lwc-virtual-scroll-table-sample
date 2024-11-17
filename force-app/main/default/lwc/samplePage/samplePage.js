import { LightningElement } from 'lwc';

const COL_SIZE = 100
const DATA_SIZE = 2000

export default class SamplePage extends LightningElement {

  data = []
  columns = []

  async connectedCallback () {

    const col = []
    for (let index = 0; index < COL_SIZE; index++) {
      col.push({
        fieldName: `col${index}`,
        label: `col${index}`
      })
    }
    this.columns = col

    this.data = await this.getData()
  }

  async getData () {
    return Array.from({ length: DATA_SIZE }, (_, i) => i + 1)
      .map(i => {
        const row = {}
        row.index = i
        for (let index = 0; index < COL_SIZE; index++) {
          row[`col${index}`] = `data${index}_${i}`
        }
        return row
      })
  }
}