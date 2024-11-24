// TODO: 表示する項目を生成する
export class Header {

  // TODO: 型定義
  #data = {}

  constructor(config) {
    this.#data = config
  }

  // DOM用
  getElements () {
    this.calcRowspanAndColspan(this.#data)
  }

  // 配列として
  getColumns () {
    // TODO: ネストの一番深い箇所を取得する
  }

  // dataのネストの深さを調べる(最深部->rowspan)
  getNestLevel (obj) {
    const getMaxDepth = (d) => {
      let maxDepth = 1
      // TODO: check 最深部のカウント
      if (d.rowspan) {
        maxDepth = d.rowspan
      }
      if (d.child) {
        d.child.forEach(child => {
          const depth = 1 + getMaxDepth(child)
          maxDepth = Math.max(maxDepth, depth)
        })
      }
      return maxDepth
    }
    const results = obj.map(d => getMaxDepth(d))
    return Math.max(...results)
  }

  // 全子要素(childプロパティ)の数をカウント
  countChildren (obj) {
    let count = 0
    obj.child.forEach(child => {
      if (child.child) {
        count += countChildren(child)
      } else {
        count++
      }
    })
    return count
  }

  // rowspanとcolspanの計算
  calcRowspanAndColspan (_data) {
    // jsonのネストの最深部のレベル
    const deepestLevel = getNestLevel(_data)
    const rows = [[]]

    const calc = (d, level) => {
      if (!rows[level]) {
        rows[level] = []
      }

      const hasChild = d.child

      let offset = 0
      // rowspan: 縦方向のセル結合(子要素あり:1,子要素なし:ネストの最深-ネストの現在の深さ)
      let rowspan
      if (d.rowspan) {
        rowspan = d.rowspan
        offset = d.rowspan - 1
      } else if (hasChild) {
        rowspan = 1
      } else {
        rowspan = deepestLevel - level
      }

      // colspan: 横方向のセル結合(子要素あり:全個要素の数,子要素なし:1)
      const colspan = hasChild ? countChildren(d) : 1

      // jsonのネストの深さ=TR要素のindexに変換
      rows[level].push({ title: d.title, rowspan, colspan })

      if (hasChild) {
        d.child.forEach((child, i) => calc(child, level + offset + 1))
      }
    }

    _data.forEach((d, i) => calc(d, 0))

    return rows
  }
}