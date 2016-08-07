<style>
.vuetable th.sortable:hover {
    color: #2185d0;
    cursor: pointer;
}

.vuetable-actions {
    width: 11%;
    padding: 12px 0px;
    text-align: center;
}

.vuetable-actions > button {
    padding: 3px 6px;
    margin-right: 4px;
}

.vuetable-pagination {}

.vuetable-pagination-info {
    float: left;
    margin-top: auto;
    margin-bottom: auto;
}

ul.pagination {
    margin: 0px;
}

.vuetable-pagination-component {
    float: right;
}
</style>
<template>
    <div class="page-bar">
        <ul class="page-breadcrumb">
            <li>
                <a v-link="{path:'/'}">Home</a>
                <i class="fa fa-circle"></i>
            </li>
            <li>
                <span>列表控件演示</span>
            </li>
        </ul>
    </div>
    <h3 class="page-title">
        <small></small>
    </h3>
    <div class="row">
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div class="portlet">
                <div class="portlet-title">
                    <div class="caption">
                        <i class="fa fa-table"></i>列表控件演示(1)
                    </div>
                    <div class="tools"></div>
                </div>
                <div class="portlet-body">
                    <!--工具栏-->
                    <div class="table-toolbar">
                        <div class="row">
                            <div class="col-md-6">
                                <div>
                                    <a href="javascript:;" class="btn btn-primary">
                                        <i class="fa fa-plus"></i> 新建 </a>
                                    <a href="javascript:;" id="btnReload" class="btn btn-info">
                                        <i class="fa fa-refresh"></i> 刷新 </a>
                                    <div class="btn-group">
                                        <button type="button" class="btn btn-warning" data-toggle="dropdown"><i class="fa fa-check-square-o"></i> 批量操作
                                        </button>
                                        <button type="button" class="btn yellow dropdown-toggle" data-toggle="dropdown"><i class="fa fa-angle-down"></i></button>
                                        <ul class="dropdown-menu" role="menu">
                                            <li>
                                                <a href="javascript:;" id="btnBatchDelte"><i
                                                        class="fa fa-trash-o"></i> 删除</a>
                                            </li>
                                            <li class="divider">
                                            </li>
                                            <li>
                                                <a href="javascript:;" class="btnBatchUpdateStatus" data-value="1"><i class="fa fa-unlock"></i> 显示</a>
                                            </li>
                                            <li>
                                                <a href="javascript:;" class="btnBatchUpdateStatus" data-value="0"><i class="fa fa-lock"></i> 隐藏</a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                            </div>
                        </div>
                    </div>
                    <vue-table v-ref:vtable api-url="/tenant/console/tenant_get_list" :fields="fields" :sort-order="sortOrder" table-class="table table-bordered table-striped table-hover" ascending-icon="glyphicon glyphicon-chevron-up" descending-icon="glyphicon glyphicon-chevron-down" pagination-path="" data-path="data" pagination-class="" pagination-info-class="" pagination-component-class="" pagination-component="vuetable-pagination-bootstrap" pagination-info-template="显示第 {from} 至 {to} 项结果，共 {total} 项" :item-actions="itemActions"></vue-table>
                </div>
            </div>
        </div>
    </div>
    <div class="clearfix"></div>
</template>
<script>
import "moment"
import VueTable from './vuetable/Vuetable.vue';

export default {
    data() {
            return {
                fields: [{
                    'name': '_id',
                    'title': 'ID',
                    'titleClass': 'text-center',
                    'dataClass': '',
                }, {
                    'name': 'name',
                    'title': '名称',
                    'titleClass': 'text-center',
                    'dataClass': '',
                }, {
                    'name': '__actions',
                    'title': '操作',
                    'titleClass': 'text-center',
                    'dataClass': '',
                }, ],
                paginationInfoTemplate: '显示第 {from} 至 {to} 项结果，共 {total} 项',
                itemActions: [{
                    name: 'view-item',
                    label: 'x',
                    icon: 'fa fa-edit',
                    class: 'btn btn-xs red'
                }, {
                    name: 'edit-item',
                    label: 'x',
                    icon: 'fa fa-file-o',
                    class: 'btn btn-xs blue'
                }, {
                    name: 'delete-item',
                    label: 'x',
                    icon: 'fa fa-font',
                    class: 'btn btn-xs green'
                }]
            }
        },
        watch: {},
        ready() {

        },
        methods: {
            /**
             * Callback functions
             */
            allCap: function(value) {
                return value.toUpperCase()
            },
            gender: function(value) {
                return value == 'M' ? '<span class="label label-info"><i class="glyphicon glyphicon-star"></i> Male</span>' : '<span class="label label-success"><i class="glyphicon glyphicon-heart"></i> Female</span>'
            },
            formatDate: function(value, fmt) {
                if (value == null) return ''
                fmt = (typeof fmt == 'undefined') ? 'D MMM YYYY' : fmt
                return moment(value, 'YYYY-MM-DD').format(fmt)
            },
            /**
             * Other functions
             */
            viewProfile: function(id) {
                //                window.location.href = '/staffs/profile/' + id
                console.log(id);
            }
        },
        events: {
            'vuetable:action': function(action, data) {
                console.log('vuetable:action', action, data)
                if (action == 'view-item') {
                    this.viewProfile(data.id)
                }
            },
            'vuetable:load-error': function(response) {
                console.log('Load Error: ', response)
            },

        },
        components: {
            'vue-table': VueTable,
        }
}
</script>
