import { LightningElement, api } from 'lwc';

const BUFFER_ROW_COUNT = 5

export default class VirtualScrollDynamicTable extends LightningElement {
  /**
   * @type {string} component visible height
   * @example '100vh', '200px'
   */
  @api viewheight = ''

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
    const viewHeightPx = element.clientHeight

    const firstVisibleIndex = this.findStartIndex(scrollTop, this.totalDataLength)
    const startIndex = Math.max(0, firstVisibleIndex - BUFFER_ROW_COUNT)

    const lastVisibleIndex = this.findEndIndex(firstVisibleIndex, this.totalDataLength, viewHeightPx)
    const endIndex = Math.min(this.totalDataLength - 1, lastVisibleIndex + BUFFER_ROW_COUNT)

    this.startRowIndex = startIndex
    this.endRowIndex = endIndex + 1
    this.offsetY_Top = this.rowPositions[startIndex]

    this.offsetY_Bottom = this.totalHeight - (this.rowPositions[endIndex] + this.getRowHeight(endIndex))
  }

  @api
  get records () {
    return this._alldata
  }

  set records (value) {
    this.totalDataLength = value.length
    this._alldata = value
    this.init()
    this.calcVisibleData()
  }

  rowPositions = []

  getRowHeight (index) {
    const item = this._alldata[index]

    if (!item) return 0

    if (item.isMainCategory) {
      return 30
    } else if (item.isSubCategory) {
      return 40
    } else {
      return 60
    }
  }

  init () {
    const positions = [0]
    for (let i = 1; i < this.totalDataLength; i++) {
      positions.push(positions[i - 1] + this.getRowHeight(i - 1))
    }
    this.rowPositions = positions
    this.totalHeight = this.rowPositions[this.totalDataLength - 1] + this.getRowHeight(this.totalDataLength - 1)
  }

  // binary search
  findStartIndex (scrollTop, itemCount) {
    let startRange = 0
    let endRange = itemCount - 1
    while (endRange !== startRange) {
      const middle = Math.floor((endRange - startRange) / 2 + startRange)
      if (
        this.rowPositions[middle] <= scrollTop &&
        this.rowPositions[middle + 1] > scrollTop
      ) {
        return middle
      }

      if (middle === startRange) {
        return endRange
      } else {
        if (this.rowPositions[middle] <= scrollTop) {
          startRange = middle
        } else {
          endRange = middle
        }
      }
    }
    return itemCount
  }

  findEndIndex (startNode, itemCount, viewHeightPx) {
    let endNode
    for (endNode = startNode; endNode < itemCount; endNode++) {
      if (this.rowPositions[endNode] > this.rowPositions[startNode] + viewHeightPx) {
        return endNode
      }
    }
    return endNode
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

  get colspan() {
    return this.columns.length
  }
}