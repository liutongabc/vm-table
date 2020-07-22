// 排序
// 参数(排序字段,排序规则)
export default {
  data() {
    return {

      //本地排序参数(排序规则,排序字段)
      sortParams: {
        pageSize: this.pageSize,
        pageNumber: this.pageNumber,
        order: "desc",
        field: ""
      },
      //多行排序数组
      internalMultipleSort: []
    }
  },
  methods: {

    setOrderClass(item, value) {
      //单行排序
      if (!this.multipleSort && item.field == this.sortParams.field) {
        return item.orderBy == value ? 'checked' : '';
      }
      //多行排序
      if (this.multipleSort) {
        return item.orderBy == value ? 'checked' : '';
      }

    },

    sort(index, field) {

      if (this.multipleSort) {
        this.internalMultipleSort.forEach((ele, i) => {
          if (ele.field == field)
            this.internalMultipleSort[i].order = this.internalColumns[index].orderBy =
            this.internalColumns[index].orderBy == "desc" ? "asc" : "desc";
        })
      } else {
        this.sortParams.order = this.internalColumns[index].orderBy =
          this.internalColumns[index].orderBy == "desc" ? "asc" : "desc";
        this.sortParams.field = field;
      }

      this.internalTableData = [];
      this.params.pageNumber = 1;
      this.sortParams.pageNumber = 1;
      this.goToTop();
      this.$emit("sort-change", this.multipleSort ? this.internalMultipleSort : this.sortParams);
    },
  },
  mounted() {
    
    this.internalColumns.forEach((ele, index) => {
      if (this.multipleSort && ele.isOrder) {

        let obj = {};
        this.$set(obj, "field", ele.field);
        this.$set(obj, "order", ele.orderBy);
        this.$set(obj, "index", index);

        this.internalMultipleSort.push(obj)

      }
      if (!this.multipleSort && ele.isOrder && ele.orderBy) {
        this.sortParams.field = ele.field;
        this.sortParams.order = ele.orderBy;
      }
    })
  }
}