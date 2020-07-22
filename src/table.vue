<template>
        <div class="table_views" :style="{width:width,height:height,backgroundColor:tableBgColor}" ref="table_views">
            <template v-if="!isNoData">
                <div class="table_leftview" v-if="fixColumn">
                    <div class="table_header" v-if="fixTitle">
                        <!--  :style="{width:fixedWidth+'px'}" -->
                        <table>
                            <tbody>
                                <tr :style="{backgroundColor:titleBgColor}">
                                    <th v-for="(item,colIndex) in internalColumns" v-if="item.isFrozen" @click.stop="titleCellClick(item.field,item.title)">
                                        <div class="tableCell" :class="{'horizontalBorder':showHorizontalBorder,'verticalBorder':showVerticalBorder}" :style="{width:item.width+'px',height:titleHeight+'px',lineHeight:titleHeight+'px',textAlign:item.titleAlign}">
                                            <span>{{item.title}}</span>
                                            <span v-if="item.isOrder" class='sort_icon' @click.stop.prevent="sort(colIndex,item.field)"><i :class="setOrderClass(item,'asc')"></i><i :class="setOrderClass(item,'desc')"></i></span>
                                        </div>
                                    </th>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="table_body" :style="{height:bodyHeight,paddingBottom:paddingBottom+'px'}" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd">
                        <table :style="{transition:`${inertiaScrollTime}ms transform ${bezier}`,transform:`translateY(${translateY}px)`}">
                            <tbody>
                                <tr v-if="!fixTitle" :style="{backgroundColor:titleBgColor}">
                                    <td v-for="(item,colIndex) in internalColumns" v-if="item.isFrozen" @click.stop="titleCellClick(item.field,item.title)">
                                        <div class="tableCell" :class="{'horizontalBorder':showHorizontalBorder,'verticalBorder':showVerticalBorder}" :style="{ width:isHorizontalResize ? '100%' : item.width+'px',height:titleHeight+'px',lineHeight:titleHeight+'px',textAlign:item.titleAlign}">
                                            <span>{{item.title}}</span>
                                            <span v-if="item.isOrder" class='sort_icon' @click.stop.prevent="sort(colIndex,item.field)"><i :class="setOrderClass(item,'asc')"></i><i :class="setOrderClass(item,'desc')"></i></span>
                                        </div>
                                    </td>
                                </tr>
                                <tr v-for="(data,rowIndex) in internalTableData" :style="setRowClickColor(rowIndex)">
                                    <td v-for="(item,colIndex) in internalColumns" v-if="item.isFrozen" @click.stop="rowCellClick(rowIndex,data,item)">
                                        <div class="tableCell" :class="{'horizontalBorder':showHorizontalBorder,'verticalBorder':showVerticalBorder}" :style="{width:item.width+'px',height:rowHeight+'px',lineHeight:rowHeight+'px',textAlign:item.columnAlign}">
                                            <span v-if="item.componentName">
                                                <component :rowData="data" :field="item.field ? item.field : ''"
                                                            :index="rowIndex" :is="item.componentName">
                                                </component>
                                            </span>
                                            <span v-else-if="typeof item.formatter==='function'"
                                                  v-html="item.formatter(data,rowIndex,item.field)"></span>
                                            <span v-else>{{data[item.field]}}</span>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    
                </div>
                <div class="table_rightview" :style="{width:unfixedWidth}">
                    <div class="table_header" v-if="fixTitle" @touchmove.stop.prevent ref="tableRightHeader">
                        <table :style="{transition:`${inertiaScrollTime}ms transform ${bezier}`,transform:`translateX(${translateX}px)`,width:isHorizontalResize?'100%':''}">
                            <tbody>
                                <tr :style="{backgroundColor:titleBgColor}">
                                    <th v-for="(item,colIndex) in internalColumns" v-if="!item.isFrozen" @click.stop="titleCellClick(item.field,item.title)">
                                        <div class="tableCell" :class="{'horizontalBorder':showHorizontalBorder,'verticalBorder':showVerticalBorder}" :style="{ width:isHorizontalResize ? '100%' : item.width+'px',height:titleHeight+'px',lineHeight:titleHeight+'px',textAlign:item.titleAlign}">
                                            <span>{{item.title}}</span>
                                            <span v-if="item.isOrder" class='sort_icon' @click.stop.prevent="sort(colIndex,item.field)"><i :class="setOrderClass(item,'asc')"></i><i :class="setOrderClass(item,'desc')"></i></span>
                                        </div>
                                    </th>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <!--  -->
                    <div class="table_body" :style="{height:bodyHeight,paddingBottom:paddingBottom+'px'}" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd" ref="tableRightBody">
                        <table :style="{transition:`${inertiaScrollTime}ms transform ${bezier}`,transform:`translate(${translateX}px,${translateY}px)`,width:isHorizontalResize?'100%':''}" ref="tableRightBody_table">
                            <tbody>
                                <tr v-if="!fixTitle" :style="{backgroundColor:titleBgColor}">
                                    <td v-for="(item,colIndex) in internalColumns" v-if="!item.isFrozen" @click.stop="titleCellClick(item.field,item.title)">
                                        <div class="tableCell" :class="{'horizontalBorder':showHorizontalBorder,'verticalBorder':showVerticalBorder}" :style="{ width:isHorizontalResize ? '100%' : item.width+'px',height:titleHeight+'px',lineHeight:titleHeight+'px',textAlign:item.titleAlign}">
                                            <span>{{item.title}}</span>
                                            <span v-if="item.isOrder" class='sort_icon' @click.stop.prevent="sort(colIndex,item.field)"><i :class="setOrderClass(item,'asc')"></i><i :class="setOrderClass(item,'desc')"></i></span>
                                        </div>
                                    </td>
                                </tr>
                                <tr v-for="(data,rowIndex) in internalTableData" :style="setRowClickColor(rowIndex)">
                                    <td v-for="(item,colIndex) in internalColumns" v-if="!item.isFrozen" @click.stop="rowCellClick(rowIndex,data,item)">
                                        <div class="tableCell" :class="{'horizontalBorder':showHorizontalBorder,'verticalBorder':showVerticalBorder}" :style="{ width:isHorizontalResize ? '100%' : item.width+'px',height:rowHeight+'px',lineHeight:rowHeight+'px',textAlign:item.columnAlign}">
                                            <span v-if="item.componentName">
                                                <component :rowData="data" :field="item.field ? item.field : ''"
                                                            :index="rowIndex" :is="item.componentName">
                                                </component>
                                            </span>
                                            <span v-else-if="typeof item.formatter==='function'"
                                                  v-html="item.formatter(data,rowIndex,item.field)"></span>
                                            <span v-else>{{data[item.field]}}</span>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <!-- 表格数据加载效果 -->
                <div v-if="isLoading" class="tableLoading">
                  <span v-if="loadingContent" v-html="loadingContent"></span>
                  <span v-else class="tableLoadingPic"></span>
                </div>
                <!-- 左右滚动箭头标识 -->
                <div v-if="isShowArrow && maxScrollWidth<0" :class="{'arrow_more':true,'active':leftArrow}" :style="{'top':arrowTop}"></div>
                <!-- 无限加载效果 -->
                <div v-if="dropDownLoad && downLoading" v-show="isShowLoading" class="downLoading">{{ downLoadingContext }}</div>
            </template>

            <template v-if="isNoData">
                <div v-if="errorContent" class="noDataCustom" :style="{height:errorContentHeight,lineHeight:errorContentHeight}" v-html="errorContent"></div>
                <div v-else class="noData" :style="{height:errorContentHeight}"></div>
            </template>
        </div>
</template>
<script>
import scrollControlMixin from "./touch-control-mixin.js";
import sortControlMixin from "./sort-control-mixin.js";
import styleControlMixin from "./style-control-mixin.js";
import arrowControlMixin from "./arrow-control-mixin.js";
import tableEventsMixin from "./table-events-mixin.js";

export default {
  name: "v-m-table",
  mixins: [scrollControlMixin, sortControlMixin, styleControlMixin,arrowControlMixin,tableEventsMixin],
  props: {
    //可传百分比,px,rem等。(要带单位)
    width: {
      type: String,
      default: "100%"
    },
    height: {
      type: String,
      default: "100%"
    },
    titleHeight: {
      type: Number,
      default: 40
    },
    rowHeight: {
      type: Number,
      default: 40
    },
    //横向自适应,开启后列宽失效自动撑开。
    isHorizontalResize: {
      type: Boolean,
      default: false
    },
    //是否固定表头
    fixTitle: {
      type: Boolean,
      default: false
    },
    //表格数据
    tableData: {
      type: Array,
      require: true,
      default: function() {
        return [];
      }
    },
    //列数据
    columns: {
      type: Array,
      require: true
    },
    //开启下拉加载
    dropDownLoad:{
       type: Boolean,
       default: false 
    },
    //每页显示条数
    pageSize: {
      type: Number,
      default: 10
    },
    //页码
    pageNumber: {
      type: Number,
      default: 1
    },
    //展示左右箭头
    isShowArrow:{
       type: Boolean,
       default: false 
    },
    //表格数据加载动效
    isLoading:{
      type: Boolean,
      default: false
    },
    //表格数据加载文字
    loadingContent:{
      type: String
    },
    //加载中文字
    downLoadingText:{
      type: String,
      default: "加载中..."
    },
    //加载完毕文字
    downLoadedText:{
      type: String,
      default: "亲，到底了"
    },
    //横向border
    showHorizontalBorder:{
      type: Boolean,
      default: true
    },
    //纵向border
    showVerticalBorder:{
      type: Boolean,
      default: false
    },
    //表格背景颜色
    tableBgColor: {
      type: String,
      default: '#fff'
    },
    // 表头背景颜色
    titleBgColor: {
      type: String,
      default: '#fff'
    },
    // 奇数行颜色
    oddBgColor: {
      type: String,
      default: ''
    },
    // 偶数行颜色
    evenBgColor: {
      type: String,
      default: ''
    },
    //行点击颜色
    rowClickColor:{
      type: String
    },
    //暂无数据提示语
    errorContent:{
      type: String,
      default: ""
    },
    //暂无数据提醒高度
    errorContentHeight:{
      type: String,
      default: ""
    },
    //多行排列
    multipleSort:{
      type:Boolean,
      default:false
    },
    isNoData:{
      type:Boolean,
      default:false
    }
  },
  data() {
    return {
      //本地列数据
      internalColumns: [],
      //本地列表数据
      internalTableData: [],
      //固定列总宽度
      fixedWidth: 0,
      //是否固定列
      fixColumn: false,
      //本地分页参数
      params: {
        pageSize: this.pageSize,
        pageNumber: this.pageNumber
      },
      //可滚动高度=表格总高度-可视区域高度
      maxScrollHeight: 0,
      maxScrollWidth: 0,
      translateX: 0,
      translateY: 0,
      downLoading: false,//下拉加载
      isShowLoading: false,//是否展示下拉loading
      // isNoData: false,
      downLoadingContext: this.downLoadingText,
      paddingBottom:this.dropDownLoad ? 40 : 0,//底部loading的高度
    };
  },
  computed: {
    bodyHeight() {
      return this.fixTitle
        ? "calc( 100% - " + this.titleHeight + "px )"
        : "100%";
    },
    unfixedWidth() {
      return "calc( 100% - " + this.fixedWidth + "px )";
    }
  },
  created() {
    this.initTable();
  },
  mounted() {
    //宽度自动适应
    this.setColumnWidth();
    //初始化渲染
    this.reset();
  },
  methods: {
    initTable() {
      [...this.internalTableData] = this.tableData;
      [...this.internalColumns] = this.columns;
      this.getFixedWidth();
    },
    //下拉加载数据
    initData() {
      if (this.translateY <= this.maxScrollHeight && !this.downLoading && this.dropDownLoad) {
        this.params.pageNumber++;
        this.downLoading = true;
        this.$emit("get-table-data", this.params);
      }
    },
    //回到顶部,向外暴露
    goToTop() {
      let self = this;
      let top = self.translateY;
      let scrollTopTimer = setInterval(function() {
        let speed = top / 4;
        self.translateY -= speed;
        if (self.translateY >= 0) {
          clearInterval(scrollTopTimer);
          self.translateY = 0;
        }
      }, 30);
      //   this.translateY = 0;
    },
    clearData(){
      this.internalTableData = [];
    }
  },
  watch: {
    tableData(newVal) {
      if(!this.dropDownLoad){
          this.internalTableData = [...newVal];
      }else{
          this.internalTableData = this.internalTableData.concat(newVal);
      }
      if(this.internalTableData.length != 0){
          // this.isNoData = false;
        if (newVal.length == 0) {
            this.downLoadingContext = this.downLoadedText;
        } else {
            this.downLoadingContext = this.downLoadingText;
            this.$nextTick(() => {
                this.reset();
                this.initData();
            });
        }
      }else{
          this.downLoadingContext = "";
          // this.isNoData = true;
      }
    }
  }
};
</script>