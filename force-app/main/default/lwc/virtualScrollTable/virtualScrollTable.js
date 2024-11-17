import { api, LightningElement } from 'lwc'

const BUFFER_ROW_COUNT = 1

export default class VirtualScrollTable extends LightningElement {
  @api viewheight = '100px' // The percentage symbol(%) does not work correctly.
  @api rowheight = 28.5 // basic slds-table-cell height(if using 'slds-table_cell-buffer' selector)
  @api columns = []

  _alldata = []
  alldatalength = 0

  visibleRowCount = 0
  startRowIndex = 0
  offsetY_Top = 0
  offsetY_Bottom = 0

  // TODO: debounce
  animationFrame = {}
  handleScroll () {
    if (this.animationFrame.current) {
      cancelAnimationFrame(this.animationFrame.current)
    }
    this.animationFrame.current = requestAnimationFrame(() => {
      this.calcVisibleData(false)
    })
  }

  calcVisibleData (isFirstTime) {
    if (isFirstTime === false) {
      const scrollTop = this.getScrollTop()
      const lastIndex = this.startRowIndex
      this.startRowIndex = Math.floor(scrollTop / this.rowheight) - BUFFER_ROW_COUNT
      this.startRowIndex = Math.max(0, this.startRowIndex)

      if (lastIndex === this.startRowIndex) {
        return
      }
    }

    const viewHeight = this.getViewHeight()
    this.visibleRowCount = Math.ceil(viewHeight / this.rowheight) + 2 * BUFFER_ROW_COUNT
    this.visibleRowCount = Math.min(this.alldatalength - this.startRowIndex, this.visibleRowCount)

    this.offsetY_Top = this.startRowIndex * this.rowheight
    this.offsetY_Bottom = this.totalHeight - this.offsetY_Top - (this.visibleRowCount * this.rowheight)
  }

  @api
  get records () {
    return this._alldata
  }

  set records (value) {
    console.time('record')
    this.alldatalength = value.length
    this._alldata = value
    this.totalHeight = this.alldatalength * this.rowheight
    this.calcVisibleData(true)
    console.timeEnd('record')
  }

  get visibledata () {
    const start = this.startRowIndex
    const end = start + this.visibleRowCount
    return this._alldata.slice(start, end)
  }

  getScrollTop () {
    const element = this.template.querySelector('.viewflame')
    return element.scrollTop
  }

  getViewHeight () {
    const element = this.template.querySelector('.viewflame')
    return element?.clientHeight ?? 0
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
}