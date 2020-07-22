export default{
  data(){
    return{
      rowClickIndex:null
    }
  },
  computed:{
    
  },
  methods:{
      //表头单击事件
      titleCellClick(field,title){
        this.$emit("title-click",field,title)
      },
      //行点击事件
      rowCellClick(rowIndex,rowData,colData){
        this.rowClickIndex=rowIndex;
        this.$emit("row-click",rowIndex,rowData,colData)
      },
      //设置行的颜色
      setRowClickColor(rowIndex){
        
        if(this.rowClickIndex==rowIndex) {
          //设置点击行颜色
          return "backgroundColor:"+this.rowClickColor;
        }else{
          //设置奇偶行颜色
          return (rowIndex+1) % 2 == 0 ? "backgroundColor:"+this.evenBgColor : "backgroundColor:"+this.oddBgColor;
        }
      },
      //清除点击行颜色
      clearCurrentRow(){
        this.rowClickIndex=null;
      }
  },

}