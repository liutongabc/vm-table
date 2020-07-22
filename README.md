
### Table props
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| width | table 宽度 | string | — | 100% |
| height | table 高度 | string | — | 100% |
| title-height | 表头行高 | number | — | 40 |
| row-height | 表格体行高 | number | — | 40 |
| is-horizontal-resize | 是否开启横向自适应（开启后会根据表格宽度自动填充，不能与isResize同时开启否则isResize会失效） | boolean | — | false |
| table-data | 表格数据集合 | array | — | array |
| columns | 列的集合。具体参考columns | array | — | array |
| fix-title | 固定表头 | boolean | — | false |
| drop-down-load |  是否开启下拉加载 | boolean | — | false |
| is-show-arrow |  展示左右箭头 | boolean | — | false |
| is-loading |  表格数据加载动画 | boolean | — | false |
| loading-content |  表格数据加载文字 | string | — | — |
| down-loading-text |  无限加载，加载中文字 | string | — | 加载中... |
| down-loaded-text |  无限加载，加载完成文字 | string | — | 亲，到底了 |
| show-horizontal-border |  横向border | boolean | — | true |
| show-vertical-border |  纵向border | boolean | — | false |
| table-bg-color |  表格背景颜色 | string | — | #fff |
| title-bg-color |  表头背景颜色 | string | — | #fff |
| odd-bg-color |  奇数行颜色 | string | — | — |
| even-bg-color |  偶数行颜色 | string | — | — |
| row-click-color |  行点击颜色 | string | — | — |
| error-content |  暂无数据提示语 | string | — | — |
| error-content-height |  暂无数据提醒高度 | string | — | — |
| multiple-sort |  多字段排序 | boolean | — | false |
| is-no-data |  暂无数据提示 | boolean | — | false |



### columns
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| field | 对应列的字段 | string | — | — |
| title | 列头显示文字 | string | — | — |
| width | 每一列的宽度，列设置列宽自适应`isResize:true`时，必须要设置值 |number  | — | — |
| titleAlign | 表头列内容对齐方式 | string | left/center/right | — |
| columnAlign | 标体列内容对齐方式 | string | left/center/right | — |
| componentName | 自定义列传入组件的名字 | string | — | — |
| isFrozen | 此列是否要固定 | boolean | — | false |
| isResize | 此列是否要自适应，与`is-horizontal-resize:true`同时设置时会失效 |  boolean| — | false |
| isOrder | 是否排序 | boolean | — | false |
| orderBy | 排序规则 | string | asc/desc | — |



### Table Event（注意传入的‘事件名称’必须和api保持一致）

| 事件名称 | 说明 | 回调参数 |
|---------- |-------- |---------- |
| get-table-data | 获取数据回调 | params 参数说明: `{pageSize：每页展示数据条数；pageNumber：页数}` |
| sort-change | 点击排序回调| params 参数说明: `{order: "asc", field: "name"}`;多行排序时参数说明:`[{order: "asc", field: "name"},...]` | — | — |
| title-click | 表头点击回调| params 参数说明: `{field,title}` | — | — |
| row-click | 行点击回调| params 参数说明: `{rowIndex,rowData,colData}` | — | — |


### Table Methods
| 事件名称 | 说明 | 回调参数 |
|---------- |-------- |---------- |
| goToTop| 回到顶部的方法（当有垂直滚动条时） | — |
| clearData| 清空数据 | — |
