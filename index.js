import VMTable from "./src/table.vue";

VMTable.install = function(Vue) {
    Vue.component(VMTable.name, VMTable);
};

export default VMTable;