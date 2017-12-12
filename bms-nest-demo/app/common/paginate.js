'use strict';

// 分页类
class Paginate {
  constructor() {
    this.size = 10;
    this.page = 1;
    this.total = 0;
  }

  // 当前页记录的开始索引
  get index() {
    return this.size * (this.page - 1);
  }
  // 总页数
  get totalPage() {
    if (this.total % this.size === 0) {
      return this.total / this.size;
    }
    return this.total / this.size + 1;

  }
}

module.exports = Paginate;
