<template>
    <div class="{{wrapperClass}}">
        <div class="row">
            <div class="col-md-4 col-sm-12 col-xs-12">
                <div class="vuetable-pagination-info {{paginationInfoClass}}" v-html="paginationInfo">
                </div>
            </div>
            <div class="col-md-8 col-sm-12 col-xs-12">
                <template v-if="!hideSearch">
                    <div class="btn-group  pull-right" style="margin-left:3px;">
                        <button type="button" class="btn blue dropdown-toggle" data-toggle="dropdown">
                            <i class="fa fa-cog"></i>
                        </button>
                        <div class="dropdown-menu hold-on-click dropdown-checkboxes" role="menu">
                            <label v-for="field in fields | customColumn" class="mt-checkbox">
                                <input type="checkbox" v-model="field.visible"> {{ field.title == '' ? field.name.replace('__', '') : field.title }}
                                <span></span>
                            </label>
                        </div>
                    </div>
                    <div class="input-group input-medium pull-right">
                        <input type="text" v-model="searchFor" class="form-control" placeholder="请输入关键字" v-on:keyup.enter="setFilter">
                        <span class="input-group-btn">
                        <button class="btn blue" v-on:click="setFilter" type="button">搜索</button>
                    </span>
                    </div>
                </template>
            </div>
        </div>
        <div class="table-responsive">
            <table class="vuetable {{tableClass}}">
                <thead>
                    <tr>
                        <template v-for="field in fields">
                            <template v-if="field.visible">
                                <template v-if="isSpecialField(field.name)">
                                    <th v-if="extractName(field.name) == '__checkbox'" class="column_checkbox {{field.titleClass || ''}}">
                                        <label class="mt-checkbox mt-checkbox-outline">
                                            <input type="checkbox" @change="toggleAllCheckboxes($event.target.checked, field.name)" />
                                            <span></span>
                                        </label>
                                    </th>
                                    <th v-else id="{{field.name}}" class="{{field.titleClass || ''}}">
                                        {{field.title || ''}}
                                    </th>
                                </template>
                                <template v-else>
                                    <th @click="orderBy(field)" id="_{{field.name}}" class="{{field.titleClass || ''}} {{isSortable(field) ? 'sortable' : ''}}">
                                        {{getTitle(field) | capitalize}}&nbsp;
                                        <i v-if="isCurrentSortField(field)" class="{{ sortIcon }}"></i>
                                    </th>
                                </template>
                            </template>
                        </template>
                    </tr>
                </thead>
                <tbody v-cloak>
                    <tr v-for="item in tableData" @click="onRowClicked(item, $event)">
                        <template v-if="onRowChanged(item)"></template>
                        <template v-for="field in fields">
                            <template v-if="field.visible">
                                <template v-if="isSpecialField(field.name)">
                                    <td v-if="extractName(field.name) == '__sequence'" class="vuetable-sequence {{field.dataClass}}" v-html="tablePagination.from + itemNumber">
                                    </td>
                                    <td v-if="extractName(field.name) == '__checkbox'" class="vuetable-checkboxes column_checkbox {{field.dataClass}}">
                                        <label class="mt-checkbox mt-checkbox-outline">
                                            <input type="checkbox" @change="toggleCheckbox($event.target.checked, item, field.name)" v-bind:checked="isSelectedRow(item, field.name)" />
                                            <span></span>
                                        </label>
                                    </td>
                                    <td v-if="field.name == '__actions'" class="vuetable-actions text-center {{field.dataClass}}">
                                        <template v-if="itemActionsCallback">
                                            <template v-for="action in actionCallback(item)">
                                                <button class="{{ action.class }}" @click="callAction(action.name, item)" v-attr="action.extra">
                                                    <i class="{{ action.icon }}"></i> {{ action.label }}
                                                </button>
                                            </template>
                                        </template>
                                        <template v-else>
                                            <template v-for="action in itemActions">
                                                <button class="{{ action.class }}" @click="callAction(action.name, item)" v-attr="action.extra">
                                                    <i class="{{ action.icon }}"></i> {{ action.label }}
                                                </button>
                                            </template>
                                        </template>
                                    </td>
                                </template>
                                <template v-else>
                                    <td v-if="hasCallback(field)" class="{{field.dataClass}}">
                                        {{{ callCallback(field, item) }}}
                                    </td>
                                    <td v-else class="{{field.dataClass}}">
                                        {{{ getObjectValue(item, field.name, "") }}}
                                    </td>
                                </template>
                            </template>
                        </template>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-if="showPagination" class="row {{paginationClass}}">
            <div class="col-md-4 col-sm-12 col-xs-12">
                <select class="vuetable-perpage-select selectpicker input-xsmall input-inline" data-show-tick="true" data-icon-base="fa" data-tick-icon="fa-check" v-model="perPage">
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                </select>
            </div>
            <div class="col-md-8 col-sm-12 col-xs-12">
                <div class="paging_simple_numbers" v-show="tablePagination && tablePagination.last_page > 1">
                    <component v-ref:pagination :is="paginationComponent"></component>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import "bootstrap-select"
import VuetablePaginationBootstrap from './VuetablePaginationBootstrap.vue';
import App from "../../js/app"
import _ from "lodash"

export default {
    props: {
        'wrapperClass': {
            type: String,
            default: function() {
                return null
            }
        },
        'tableWrapper': {
            type: String,
            default: function() {
                return null
            }
        },
        'tableClass': {
            type: String,
            default: function() {
                return 'ui blue striped selectable celled stackable attached table'
            }
        },
        'loadingClass': {
            type: String,
            default: function() {
                return 'loading'
            }
        },
        'dataPath': {
            type: String,
            default: function() {
                return 'data'
            }
        },
        'paginationPath': {
            type: String,
            default: function() {
                return 'links.pagination'
            }
        },
        'fields': {
            type: Array,
            required: true
        },
        'apiUrl': {
            type: String,
            required: true
        },
        'sortOrder': {
            type: Object,
            default: function() {
                return {
                    field: '',
                    direction: 'asc'
                }
            }
        },
        'perPage': {
            type: Number,
            coerce: function(val) {
                return parseInt(val)
            },
            default: function() {
                return 10
            }
        },
        'ascendingIcon': {
            type: String,
            default: function() {
                return 'blue chevron up icon'
            }
        },
        'descendingIcon': {
            type: String,
            default: function() {
                return 'blue chevron down icon'
            }
        },
        'hideSearch': {
            type: Boolean,
            default: false,
        },
        'appendParams': {
            type: Array,
            default: function() {
                return []
            }
        },
        'showPagination': {
            type: Boolean,
            default: function() {
                return true
            }
        },
        'paginationComponent': {
            type: String,
            default: function() {
                return 'vuetable-pagination'
            }
        },
        'paginationInfoTemplate': {
            type: String,
            default: function() {
                return "显示第 {from} 至 {to} 项结果，共 {total} 项"
            }
        },
        'paginationInfoNoDataTemplate': {
            type: String,
            default: function() {
                return '暂无相关数据'
            }
        },
        'paginationClass': {
            type: String,
            default: function() {
                return 'ui bottom attached segment grid'
            }
        },
        'paginationInfoClass': {
            type: String,
            default: function() {
                return 'left floated left aligned six wide column'
            }
        },
        'paginationComponentClass': {
            type: String,
            default: function() {
                return 'right floated right aligned six wide column'
            }
        },
        itemActions: {
            type: Array,
            default: function() {
                return []
            }
        },
        itemActionsCallback: {
            type: Function,
            default: null
        },
        queryParams: {
            type: Object,
            default: function() {
                return {
                    sort: 'sort',
                    page: 'page',
                    perPage: 'per_page'
                }
            }
        },
        loadOnStart: {
            type: Boolean,
            default: function() {
                return true
            }
        },
        selectedTo: {
            twoWay: true,
            type: Array,
            default: function() {
                return []
            }
        }
    },
    data: function() {
        return {
            eventPrefix: 'vuetable:',
            tableData: null,
            tablePagination: null,
            currentPage: 1,
            searchFor: ''
        }
    },
    computed: {
        sortIcon: function() {
            return this.sortOrder.direction == 'asc' ? this.ascendingIcon : this.descendingIcon
        },
        paginationInfo: function() {
            if (this.tablePagination == null || this.tablePagination.total == 0) {
                return this.paginationInfoNoDataTemplate
            }

            return this.paginationInfoTemplate
                .replace('{from}', this.tablePagination.from || 0)
                .replace('{to}', this.tablePagination.to || 0)
                .replace('{total}', this.tablePagination.total || 0)
        },
    },
    methods: {
        setFilter: function() {
            var moreParams = [];
            if (this.searchFor != '') {
                moreParams = [
                    'filter=' + encodeURIComponent(this.searchFor)
                ];
            }

            //删除原来的filter
            this.appendParams = _.filter(this.appendParams, function(o) {
                return o.indexOf('filter=') == -1;
            });


            this.appendParams = _.union(moreParams, this.appendParams);

            this.$nextTick(function() {
                this.currentPage = 1;
                this.loadData();
            })
        },
        normalizeFields: function() {
            var self = this
            var obj
            this.fields.forEach(function(field, i) {
                if (typeof(field) === 'string') {
                    obj = {
                        name: field,
                        title: self.setTitle(field),
                        titleClass: '',
                        dataClass: '',
                        callback: null,
                        visible: true
                    }
                } else {
                    obj = {
                        name: field.name,
                        title: (field.title === undefined) ? self.setTitle(field.name) : field.title,
                        sortField: field.sortField,
                        titleClass: (field.titleClass === undefined) ? '' : field.titleClass,
                        dataClass: (field.dataClass === undefined) ? '' : field.dataClass,
                        callback: (field.callback === undefined) ? '' : field.callback,
                        visible: (field.visible === undefined) ? true : field.visible
                    }
                }
                self.fields.$set(i, obj)
            })
        },
        setTitle: function(str) {
            if (this.isSpecialField(str)) {
                return ''
            }

            return this.titleCase(str)
        },
        titleCase: function(str) {
            return str.replace(/\w+/g, function(txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
            })
        },
        loadData: function() {
            var wrapper = document.querySelector(this.tableWrapper)
            this.showLoadingAnimation(wrapper)

            var params = [
                this.queryParams.sort + '=' + this.getSortParam(),
                this.queryParams.page + '=' + this.currentPage,
                this.queryParams.perPage + '=' + this.perPage
            ]

            var url = this.apiUrl + '?' + params.join('&')
            if (this.appendParams.length > 0) {
                url += '&' + this.appendParams.join('&')
            }
            var self = this
            this.$http.get(url)
                .then(function(response) {
                    self.tableData = self.getObjectValue(response.data, self.dataPath, null)
                    self.tablePagination = self.getObjectValue(response.data, self.paginationPath, null)
                    if (self.tablePagination === null) {
                        console.warn('vuetable: pagination-path "' + self.paginationPath + '"" not found. ' + 'It looks like the data returned from the sever does not have pagination information.')
                    }

                    self.dispatchEvent('load-success', response)
                    self.broadcastEvent('load-success', self.tablePagination)

                    self.hideLoadingAnimation(wrapper)
                }, function(response) {
                    self.dispatchEvent('load-error', response)
                    self.broadcastEvent('load-error', response)

                    self.hideLoadingAnimation(wrapper)
                })
        },
        showLoadingAnimation: function(wrapper) {
            if (wrapper !== null) {
                this.addClass(wrapper, this.loadingClass)
            }
            this.dispatchEvent('loading')
        },
        hideLoadingAnimation: function(wrapper) {
            if (wrapper !== null) {
                this.removeClass(wrapper, this.loadingClass)
            }
            this.dispatchEvent('loaded')
        },
        getTitle: function(field) {
            if (typeof field.title === 'undefined') {
                return field.name.replace('.', ' ')
            }
            return field.title
        },
        getSortParam: function() {
            if (!this.sortOrder || this.sortOrder.field == '') {
                return ''
            }

            var fieldName = (typeof this.sortOrder.sortField === 'undefined') ? this.sortOrder.field : this.sortOrder.sortField

            return fieldName + '|' + this.sortOrder.direction
        },
        addClass: function(el, className) {
            if (el.classList)
                el.classList.add(className)
            else
                el.className += ' ' + className
        },
        removeClass: function(el, className) {
            if (el.classList)
                el.classList.remove(className)
            else
                el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ')
        },
        dispatchEvent: function(eventName, args) {
            this.$dispatch(this.eventPrefix + eventName, args)
        },
        broadcastEvent: function(eventName, args) {
            this.$broadcast(this.eventPrefix + eventName, args)
        },
        orderBy: function(field) {
            if (!this.isSortable(field)) {
                return
            }

            if (this.sortOrder.field == field.name) {
                // change sort direction
                this.sortOrder.direction = this.sortOrder.direction == 'asc' ? 'desc' : 'asc'
            } else {
                // reset sort direction
                this.sortOrder.direction = 'asc'
            }
            this.sortOrder.field = field.name
            this.sortOrder.sortField = field.sortField
            this.currentPage = 1 // reset page index
            this.loadData()
        },
        isSortable: function(field) {
            return !(typeof field.sortField == 'undefined')
        },
        isCurrentSortField: function(field) {
            if (!this.isSortable(field)) {
                return false
            }
            return this.sortOrder.field == field.name
        },
        gotoPreviousPage: function() {
            if (this.currentPage > 1) {
                this.currentPage--
                    this.loadData()
            }
        },
        gotoNextPage: function() {
            if (this.currentPage < this.tablePagination.last_page) {
                this.currentPage++
                    this.loadData()
            }
        },
        gotoPage: function(page) {
            if (page != this.currentPage && (page > 0 && page <= this.tablePagination.last_page)) {
                this.currentPage = page
                this.loadData()
            }
        },
        isSpecialField: function(fieldName) {
            return fieldName.startsWith('__')
        },
        hasCallback: function(item) {
            return item.callback ? true : false
        },
        callCallback: function(field, item) {
            if (!this.hasCallback(field))
                return

            var args = field.callback.split('|')
            var func = args.shift()
            if (typeof this.$parent[func] == 'function') {
                return (args.length > 0) ? this.$parent[func].apply(this.$parent, [this.getObjectValue(item, field.name), item].concat(args)) : this.$parent[func].call(this.$parent, this.getObjectValue(item, field.name), item)
            } else if (typeof this.$parent.$parent[func] == 'function') {
                return (args.length > 0) ? this.$parent.$parent[func].apply(this.$parent.$parent, [this.getObjectValue(item, field.name), item].concat(args)) : this.$parent.$parent[func].call(this.$parent.$parent, this.getObjectValue(item, field.name), item)
            }

            return null
        },
        actionCallback: function(item) {
            if (this.itemActionsCallback) {
                return this.itemActionsCallback.call(this.$parent, item);
            }
            return [];
        },
        getObjectValue: function(object, path, defaultValue) {
            defaultValue = (typeof defaultValue == 'undefined') ? null : defaultValue

            var obj = object
            if (path.trim() != '') {
                var keys = path.split('.')
                keys.forEach(function(key) {
                    if (typeof obj[key] != 'undefined' && obj[key] !== null) {
                        obj = obj[key]
                    } else {
                        obj = defaultValue
                        return
                    }
                })
            }
            return obj
        },
        callAction: function(action, data) {
            this.$dispatch(this.eventPrefix + 'action', action, data)
        },
        addParam: function(param) {
            this.appendParams.push(param)
        },
        toggleCheckbox: function(isChecked, dataItem, fieldName) {
            var idColumn = this.extractArgs(fieldName);
            if (idColumn === undefined) {
                console.warn('You did not provide reference id column with "__checkbox:<column_name>" field!')
                return
            }
            if (isChecked) {
                this.selectedTo.push(dataItem[idColumn])
            } else {
                this.selectedTo.$remove(dataItem[idColumn])
            }
        },
        'toggleAllCheckboxes': function(isChecked, fieldName) {
            var self = this
            var idColumn = this.extractArgs(fieldName)
            if (isChecked) {
                if (this.tableData) {
                    this.tableData.forEach(function(dataItem) {
                        if (!self.isSelectedRow(dataItem, fieldName)) {
                            self.selectedTo.push(dataItem[idColumn])
                        }
                    })
                }
            } else {
                if (this.tableData) {
                    this.tableData.forEach(function(dataItem) {
                        self.selectedTo.$remove(dataItem[idColumn])
                    })
                }
            }
        },
        'isSelectedRow': function(dataItem, fieldName) {
            var b = this.selectedTo.indexOf(dataItem[this.extractArgs(fieldName)]) >= 0;
            return b;
        },
        'extractName': function(string) {
            return string.split(':')[0].trim()
        },
        'extractArgs': function(string) {
            return string.split(':')[1]
        },
        'onRowChanged': function(dataItem) {
            this.dispatchEvent('row-changed', dataItem)
            return true
        },
        'onRowClicked': function(dataItem, event) {
            this.$dispatch(this.eventPrefix + 'row-clicked', dataItem, event)
            return true
        },
        'callPaginationConfig': function() {
            if (typeof this.$parent[this.paginationConfig] === 'function') {
                this.$parent[this.paginationConfig].call(this.$parent, this.$refs.pagination.$options.name)
            }
        },
    },
    directives: {
        'attr': {
            update: function(value) {
                for (var i in value) {
                    this.el.setAttribute(i, value[i])
                }
            }
        },
    },
    events: {
        'vuetable:loading': function() {
            App.blockUI({
                target: $(this.$el),
                boxed: true,
                message: '数据加载中...'
            });
        },
        'vuetable:load-success': function() {
            App.unblockUI($(this.$el));
        },
        'vuetable-pagination:change-page': function(page) {
            if (page == 'prev') {
                this.gotoPreviousPage()
            } else if (page == 'next') {
                this.gotoNextPage()
            } else if (page == 'first') {
                this.gotoPage(1)
            } else if (page == 'last') {
                this.gotoPage(this.tablePagination.last_page || 0)
            } else {
                this.gotoPage(page)
            }
        },
        'vuetable:reload': function() {
            this.loadData()
        },
        'vuetable:refresh': function() {
            this.currentPage = 1;
            this.loadData()
        },
        'vuetable:goto-page': function(page) {
            this.$emit('vuetable-pagination:change-page', page)
        },
        'vuetable:reset-search-and-reload': function(target) {
            if (target && target == this) {
                this.searchFor = "";
                this.setFilter();
            }
        }
    },
    created: function() {
        this.normalizeFields()
        if (this.loadOnStart) {
            this.loadData()
        }
    },
    ready: function() {
        $('.selectpicker').selectpicker();
    },
    filters: {
        customColumn: function(value) {
            var result = [];
            _.each(value, function(v, k) {
                if (v.name.indexOf('__checkbox') == -1) {
                    result.push(v);
                }
            });
            return result;
        }
    },
    watch: {
        'perPage': function(val, oldVal) {
            this.$dispatch('vuetable:refresh')
        },
    },
    components: {
        'vuetable-pagination-bootstrap': VuetablePaginationBootstrap
    }
}
</script>
<style>
@import "../../../node_modules/bootstrap-select/dist/css/bootstrap-select.min.css";
.vuetable {
    margin: 10px 0px !important;
}

.vuetable .column_checkbox {
    width: 40px !important;
}

.vuetable th.sortable:hover {
    color: #2185d0;
    cursor: pointer;
}

.vuetable-actions {
    width: 15%;
    padding: 12px 0px;
    text-align: center;
}

.vuetable-pagination {
    background: #f9fafb !important;
}

.vuetable-pagination-info {
    padding-top: 8px;
}

.paging_simple_numbers {
    text-align: right;
}

.vuetable-perpage-select {
    float: left;
    margin-right: 5px;
}

.vuetable .mt-checkbox,
.vuetable .mt-radio {
    padding-left: 20px !important;
}
</style>
