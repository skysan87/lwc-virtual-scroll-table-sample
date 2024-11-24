import { LightningElement } from 'lwc';

const COL_SIZE = 100
const DATA_SIZE = 100

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
    return Array.from({ length: DATA_SIZE })
      .map((_, i) => {
        const row = {}
        row.index = i
        if (i % 10 === 0) {
          row.isMainCategory = true
        } else if (i % 7 === 0) {
          row.isSubCategory = true
        } else {
          row.isItem = true
        }
        for (let index = 0; index < COL_SIZE; index++) {
          row[`col${index}`] = `row${i}_col${index}`
        }
        return row
      })
  }
}