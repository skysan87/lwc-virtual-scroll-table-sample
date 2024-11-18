import { api, LightningElement } from 'lwc'

const BUFFER_ROW_COUNT = 5

export default class VirtualScrollTable extends LightningElement {
  /**
   * @type {string} component visible height
   * @description The percentage symbol(%) does not work correctly.
   * @example '100vh', '200px'
   */
  @api viewheight = ''

  /**
   * @type {number} table-row height
   */
  @api rowheight = 28.5 // basic slds-table-cell height(if using 'slds-table_cell-buffer' selector)
  /**
   * @type {{ label: string, fieldName: string }[]} columns config
   */
  @api columns = []

  _alldata = []
  totalDataLength = 0

  startRowIndex = 0
  endRowIndex = 0
  offsetY_Top = 0
  offsetY_Bottom = 0

  frameId = -1

  connectedCallback () {
    window.addEventListener('resize', () => this.calcVisibleData())
  }

  handleScroll () {
    cancelAnimationFrame(this.frameId)
    this.frameId = requestAnimationFrame(() => this.calcVisibleData())
  }

  calcVisibleData () {
    const element = this.template.querySelector('.viewflame')
    if (!element) return

    const scrollTop = element.scrollTop
    const viewHeight = element.clientHeight

    let rowIndex = Math.floor(scrollTop / this.rowheight) - BUFFER_ROW_COUNT
    rowIndex = Math.max(0, rowIndex)

    let rowCount = Math.ceil(viewHeight / this.rowheight) + 2 * BUFFER_ROW_COUNT
    rowCount = Math.min(this.totalDataLength - rowIndex, rowCount)

    this.startRowIndex = rowIndex
    this.endRowIndex = rowIndex + rowCount
    this.offsetY_Top = this.startRowIndex * this.rowheight
    this.offsetY_Bottom = this.totalHeight - this.offsetY_Top - (rowCount * this.rowheight)
  }

  @api
  get records () {
    return this._alldata
  }

  set records (value) {
    this.totalDataLength = value.length
    this._alldata = value
    this.totalHeight = this.totalDataLength * this.rowheight
    this.calcVisibleData()
  }

  get visibledata () {
    return this._alldata.slice(this.startRowIndex, this.endRowIndex)
  }

  get transformTopStyle () {
    return `height: ${this.offsetY_Top}px; padding: 0; border: 0px;`
  }

  get transformBottomStyle () {
    return `height: ${this.offsetY_Bottom}px; padding: 0; border: 0px;`
  }

  get viewflameStyle () {
    return `
      height: ${this.viewheight};
      max-height: ${this.viewheight};
      overflow: auto;
    `
  }

  get rowStyle () {
    return `height: ${this.rowheight}px;`
  }

  get colspan () {
    return this.columns.length
  }
}