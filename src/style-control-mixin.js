export default {
  methods: {
    setColumnWidth() {
      //当前内容宽度，需要自适应的列数
      let width = 0,
        resizeNum = 0;
      this.internalColumns.forEach(obj => {
        if (obj.width) {
          width += obj.width;
        }
        if (obj.isResize) {
          resizeNum++;
        }
      });
      //当有剩余宽度时，剩余宽度平均分配
      if (this.$refs.table_views.clientWidth > width) {
        let remainWidth = this.$refs.table_views.clientWidth - width,
          everyWidth = Math.floor(remainWidth / resizeNum);
        this.internalColumns.forEach(obj => {
          if (obj.isResize) {
            obj.width += everyWidth;
          }
        });
      }
    },
    //计算固定列宽度
    getFixedWidth() {
      let width = 0;
      this.columns.forEach(obj => {
        if (obj.isFrozen) {
          width += obj.width;
          this.fixColumn = true;
        }
      });
      this.fixedWidth = width;
    },
    //重新计算可滚动高度
    reset() {

      if (this.$refs.tableRightBody && this.$refs.tableRightBody_table) {

        // if (parseInt(window.getComputedStyle(this.$refs.tableRightBody_table).height) + this.titleHeight < parseInt(window.getComputedStyle(this.$refs.table_views).height)) {
        //   this.tableHeight = parseInt(window.getComputedStyle(this.$refs.tableRightBody_table).height) + this.titleHeight + "px"
        // }

        this.$nextTick(() => {

          this.maxScrollWidth =
          parseInt(window.getComputedStyle(this.$refs.tableRightBody).width) > parseInt(window.getComputedStyle(this.$refs.tableRightBody_table).width)
            ? 0
            : parseInt(window.getComputedStyle(this.$refs.tableRightBody).width) -
              parseInt(
                window.getComputedStyle(this.$refs.tableRightBody_table).width
              );

          this.maxScrollHeight =
            parseInt(window.getComputedStyle(this.$refs.tableRightBody).height) > this.paddingBottom + parseInt(window.getComputedStyle(this.$refs.tableRightBody_table).height)
              ? 0 
              : parseInt(window.getComputedStyle(this.$refs.tableRightBody).height) -
                parseInt(
                  window.getComputedStyle(this.$refs.tableRightBody_table).height
                ) -
                this.paddingBottom;
          this.downLoading = false;

        })

      }
    }
  }
}